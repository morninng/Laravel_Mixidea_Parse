

  var parse_app_id = "EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX";
  var parse_js_key = "US6Lheio8PGcBdIpwGFhFSQVpi5GKunGf6hGq5Ze";
  Parse.initialize(parse_app_id, parse_js_key);

  var appData = gadgets.views.getParams()['appData'];	
  var appData_split = appData.split("_");
  var global_own_parse_id = appData_split[0];
  var global_debate_game_id = appData_split[1];
  var global_original_hangout_appid = appData_split[2];
  var global_own_hangout_id = "";

// global object
 var actual_game_obj = new Object();
 var participant_mgr_obj = new ParticipantMgr();
 var discussion_note_obj = new DiscussNoteWrapper();
 var game_status_obj =  new Game_Status_Mgr();
 var layout_obj = new Construct_Layout();
 var video_view_wrapper = new VideoViewWrapper();
 var appmgr = new AppMgr();
 var sound_mgr = new SoundMgr();
 sound_mgr.init();
 var title_view_model_wrapper = new Title_VM_wrapper();
 var impression_wrapper_obj = new Impression_wrapper();
 var link_to_teamdisucuss_obj = new LinkToTeamDiscussWrapper();

 var after_debate_obj = new AfterDebateTabWrapper();
 var note_take_obj = new NoteTakingTabWrapper();

 var chat_wrapper_obj = new ChatVM_wrapper();

 var participant_table = new ParticipantTableMgr();
 var preparation_time = new PreparationTimer();
 var debater_bar_obj = new DebaterBar();
 var recording_wrapper_obj = new RecordingWrapper();
 var audio_transcript_obj = new AudioTransript();

  window.onload = function(){
    Hangout_Init();
  } 

function Mixidea_init(){

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.include("participants");
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      actual_game_obj = obj;
      participant_mgr_obj.initialize();
      add_own_hangoutid();
      layout_obj.update_structure();
      game_status_obj.initialize();
      RegisterHangoutEvent();
    },
    error: function(error) {
      alert("something happen and creating event failed" + error.message);
      //data should be vaidated before upload and the error should not happen in server side
    }
  });
}

function add_own_hangoutid(){

  var own_hangoutid_mapping_obj = new Object();

  var own_mapping_data = new Object();
  var own_mapping_key = "mapping_" + global_own_parse_id;
  var own_mapping_value = {"parse_id":global_own_parse_id, "hangout_id":global_own_hangout_id};
  var own_mapping_value_str = JSON.stringify(own_mapping_value);
  own_hangoutid_mapping_obj[own_mapping_key] = own_mapping_value_str;

  var hangout_mapping_counter = get_parse_hangout_mapping_data_counter();
  hangout_mapping_counter++;
  var hangout_mapping_counter_str = String(hangout_mapping_counter);
  own_hangoutid_mapping_obj["parse_hangout_mapping_counter"] = hangout_mapping_counter_str

  gapi.hangout.data.submitDelta(own_hangoutid_mapping_obj);
}

function is_own_hangoutid(){

  var own_mapping_key = "mapping_" + global_own_parse_id;
  var own_mapping_data_str = gapi.hangout.data.getValue(own_mapping_key);
  if(!own_mapping_data_str){
    console.log("mapping data data do not exist");
    return false;
  }
  var own_mapping_data =  JSON.parse(own_mapping_data_str);
  var hangout_id = own_mapping_data["hangout_id"];
  if(hangout_id != global_own_hangout_id){
    console.log("no own mapping data");
    return false;
  }
  console.log("own hangout mapping data exist");
  return true;
}




function Hangout_Init() {
  gapi.hangout.onApiReady.add(function(e){
    console.log("hangout api ready");
    if(e.isApiReady){
      global_own_hangout_id = gapi.hangout.getLocalParticipantId();
    	Mixidea_init();
    }
  });
}

function RegisterHangoutEvent(){
  gapi.hangout.data.onStateChanged.add(function(event) {
    appmgr.update_hangout_status(event);
  });
  gapi.hangout.onParticipantsChanged.add(function(participant_change) {
    appmgr.participants_change(participant_change);
  });
  gapi.hangout.data.onMessageReceived.add(function(received_message) {
    appmgr.receive_message(received_message);
  });
}

function AppMgr() {
  var self = this;;
  self.hangout_mapping_changed_counter = 0;
  self.hangout_speech_status_counter = 0; 
  self.game_obj_counter = 0;
  self.parse_data_changed_counter = 0;
  self.discuss_note_edit_counter = 0;
  self.discuss_note_content_counter = 0;
  self.AfterDiscuss_counter = 0
  self.first_update_done = false;
 // self.handleEvent();
}

AppMgr.prototype.update_hangout_status = function(event){

  var self = this;

  if(!is_own_hangoutid()){
    add_own_hangoutid();
  }

  if(self.first_update_done == false ||   self.hangout_mapping_changed_counter != get_parse_hangout_mapping_data_counter()){

    participant_mgr_obj.update_parseid_hangoutid_mapping();
    participant_mgr_obj.update_hangout_participants();  
    participant_table.update_table_from_server();
    chat_wrapper_obj.update_from_server();
    self.hangout_mapping_changed_counter = get_parse_hangout_mapping_data_counter();
  }

  if(self.first_update_done == false || self.hangout_speech_status_counter != get_hangout_speech_status_counter()){
    var hangout_speech_status = get_hangout_speech_status();

    video_view_wrapper.update_from_server();
    self.hangout_speech_status_counter = get_hangout_speech_status_counter();
  }



  if( self.discuss_note_edit_counter != get_hangout_discuss_note_edit_counter()){
    discussion_note_obj.update_from_server_edit_status();
    self.discuss_note_edit_counter = get_hangout_discuss_note_edit_counter()
  }

  if( self.discuss_note_content_counter != get_hangout_discuss_note_content_counter()){
    discussion_note_obj.update_from_server_content_status();
    self.discuss_note_content_counter = get_hangout_discuss_note_content_counter()
  }


  if( self.AfterDiscuss_counter != get_hangout_after_discuss_counter()){
    
    after_debate_obj.update_from_server();
    self.AfterDiscuss_counter = get_hangout_after_discuss_counter();
  }



  if(self.first_update_done == false || self.parse_data_changed_counter != get_parse_data_changed_counter()){
//  if(true){
    

    var Game = Parse.Object.extend("Game");
    var game_query = new Parse.Query(Game);
    game_query.include("participants");
    game_query.get(global_debate_game_id, {
      success: function(obj) {
        actual_game_obj = obj;
        participant_mgr_obj.update_parseid_hangoutid_mapping();
        participant_mgr_obj.update_parse_data();
        layout_obj.update_from_server();

        title_view_model_wrapper.update_from_server();

        video_view_wrapper.update_from_server();


        chat_wrapper_obj.update_from_server();
        participant_table.update_table_from_server();
        link_to_teamdisucuss_obj.update_from_server();

        self.hangout_speech_status_counter = get_hangout_speech_status_counter();
          self.parse_data_changed_counter  = get_parse_data_changed_counter();
      },
      error: function(error) { 
        console.log(error); 
      }
    });
  }
  self.first_update_done = true;
}

AppMgr.prototype.participants_change = function(participant_change){

  var self = this;

  participant_mgr_obj.update_hangout_participants();

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.include("participants");
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      actual_game_obj = obj;
      participant_mgr_obj.update_parse_data();  
      participant_table.update_table_from_server();
      video_view_wrapper.update_from_server();
    },
    error: function(error) {
      console.log(error);    
     }
  });
}

AppMgr.prototype.receive_message = function(received_message){

  var self = this;

  var sender_hangout_id = received_message.senderId;

  received_message_json = JSON.parse(received_message.message);
  var type = received_message_json["type"];
  var message_obj = received_message_json["message"];

  switch (type){
    case "sound":
      impression_wrapper_obj.receive_message(message_obj);
    break;
    case "chat":
      chat_wrapper_obj.receive_message(message_obj, sender_hangout_id)
    break;
  }
}
/*
AppMgr.prototype.handleEvent = function(){
  var self = this;
  var timer = false;

  $(window).on('resize', function(){
      if (timer !== false) {
          clearTimeout(timer);
      }
      timer = setTimeout(function() {
          console.log("window resized");
      }, 200);
  });

}
*/