
function AppMgr() {
  	var self = this;
	self.own_parse_id=global_own_parse_id;
	self.game_id=global_debate_game_id;
	self.own_hangoutid = "";
	self.actual_game_obj = new Object();
	self.game_status = 2;
	// self.participant_changed_counter = 0;
	self.hangout_mapping_changed_counter = 0;
	self.hangout_speech_status_counter = 0; 
	self.game_obj_counter = 0;
	self.parse_data_changed_counter = 0;
	self.transcription_counter = 0

	self.first_update_done = false;
}

AppMgr.prototype.initialize = function(in_actual_game_obj){

  	var self = this;

	self.own_hangoutid = get_own_hangout_id();
	self.participant_manager_object = new ParticipantMgr();

	// hangout statusで受け取るJSONコード
/*
	var parse_hangout_mapping = [
		         {parse_id:"37mnmciaGV", hangout_id:"hangout_XXX1"},
		         {parse_id:"YYYY", hangout_id:"hangout_XXX2"},
		         {parse_id:"tQDJHWFq27", hangout_id:"hangout_XXX3"},
		         {parse_id:"XXXX", hangout_id:"ZZZZZ"},
		         {parse_id:"6ZMl4LGKim", hangout_id:"hangout_XXX4"}
		         ];
*/
	var parse_hangout_mapping_array = get_parse_hangout_mapping_data();
	self.participant_manager_object.update_parseid_hangoutid_mapping();
//	self.hangout_mapping_changed_counter = get_parse_hangout_mapping_data_counter();
//	self.participant_manager_object.set_parseid_hangoutid_mapping(parse_hangout_mapping_array );

	
/*
	self.game_obj = {
	game_style:"NorthAmerica",
	debater_data_array:[
		{role:"PrimeMinister",parse_id:"parse_XXX2",first_name:"Yagi",last_name:"Moriyama",pict_src:"./picture/download.jpg"},
		{role:"LeaderOpposition", parse_id:"parse_XXX2",first_name:"Flower",last_name:"AAA",pict_src:"./picture/flower.jpg"},
		{role:"ReplyPM", parse_id:"parse_XXX3",first_name:"Yuta",last_name:"Beautiful",pict_src:"./picture/1005335_976308.jpg"},
		{role:"LOReply", parse_id:"XXXX",first_name:"ccc",last_name:"Girl",pict_src:"./picture/robot.jpg"}
		],
	audience_data_array:
		[{role:"audience1",parse_id:"tQDJHWFq27",first_name:"Robot",last_name:"robot",pict_src:"robot.jpg"},
		 {role:"audience2",parse_id:"tQDJHWFq27",first_name:"ccc",last_name:"CCC",pict_src:"http://eee.jpg"}
		],
	hangout_ids:
		{
		 main:"XXXX",
		 Gov:"YYYY",
		 Opp:"ZZZ"
		},
	game_title:"thw legalize tobacco"
	};
*/

	self.actual_game_obj = in_actual_game_obj;
	self.game_obj_counter =	get_game_obj_counter();
	self.participant_manager_object.initialize(); 


	var Transcription_html_Template = _.template($('[data-template="transcription_template"]').html());
    var transcription_element = $("#transcription_area");
    var transcription_html_text = Transcription_html_Template();
    transcription_element.html(transcription_html_text);

    self.transcription_mgr = new TranscriptionMgr();
    var transcription_el = document.getElementById('transcription_area');
    ko.applyBindings(self.transcription_mgr , transcription_el);
    var transcription_obj = self.actual_game_obj.get("speech_transcription");
    self.transcription_mgr.initialize(transcription_obj.id);

	//hangout_statusで受け取る game statusをparticipantmgr, container_modelview, chat_mgr,に反映 
	//participant changed eventが走るときに毎回呼び出す。

	var Video_html_Template = _.template($('[data-template="video_area_template"]').html());
    var video_element = $("#video_area");
    var Video_html_text = Video_html_Template();
    video_element.html(Video_html_text);

    self.video_view_model = new VideoViewModel(self.own_hangoutid);
    var video_el = document.getElementById('video_area');
    ko.applyBindings(self.video_view_model, video_el);

	// hangout statusで受け取るJSONコード
	/*
	var hangout_speech_status = {
		poi_speaker: {hangout_id :"hangout_XXX1", role : "POI"},
		speaker: {hangout_id :"hangout_XXX1", role : "PrimeMinister"},
		poi_candidate: ["hangout_XXX2", "hangout_XXX3"]
	}*/
	self.parse_data_changed_counter = get_parse_data_changed_counter();

/*
	var hangout_speech_status = {
	//	poi_speaker: {hangout_id :"hangout_XXX4", role : "LeaderOpposition"},
		poi_speaker: null,
		speaker: {hangout_id :"hangout_XXX4", role : "PrimeMinister"},
	//	speaker: null,
		 poi_candidate: ["hangout_XXX1","hangout_XXX3"]
	//	 poi_candidate: []
	}
*/

	var hangout_speech_status = get_hangout_speech_status();
	self.hangout_speech_status_counter = get_hangout_speech_status_counter();
	self.video_view_model.update_button(hangout_speech_status);
	self.video_view_model.update_speaker(hangout_speech_status);
	self.video_view_model.update_poi_candidate(hangout_speech_status);


	var Chat_html_Template = _.template($('[data-template="chat_template"]').html());
    var chat_element = $("#absolute_pain_1");
    var Chat_html_text = Chat_html_Template();
    chat_element.html(Chat_html_text);

    self.chat_view_model = new ChatViewModel();
    var chat_el = document.getElementById('chat_field');
    ko.applyBindings(self.chat_view_model, chat_el);
    self.chat_view_model.update();


	var Title_html_Template = _.template($('[data-template="title_template"]').html());
    var title_element = $("#title_area");
    var Title_html_text = Title_html_Template();
    title_element.html(Title_html_text);

    self.title_view_model = new title_VM();
    var title_el = document.getElementById('title_template_area');
    ko.applyBindings(self.title_view_model, title_el);
    self.title_view_model.initialize();



	var GameStatus_html_Template = _.template($('[data-template="gamestatus_template"]').html());
    var gamestatus_element = $("#game_status_area");
    var gamestatus_html_text = GameStatus_html_Template();
    gamestatus_element.html(gamestatus_html_text);
    
	self.game_status_mgr = new Game_Status_Mgr();
    var gamestatus_el = document.getElementById('game_status_area');
    ko.applyBindings(self.game_status_mgr , gamestatus_el);
	self.game_status_mgr.initialize();

	self.sound_mgr = new SoundMgr();
	self.sound_mgr.init();


	var Impression_html_Template = _.template($('[data-template="impression_template"]').html());
    var impression_element = $("#impression_area");
    var impression_html_text = Impression_html_Template();
    impression_element.html(impression_html_text);

	self.impression_mgr = new ImpressionMgr();
    var impression_el = document.getElementById('impression_area');
    ko.applyBindings(self.impression_mgr , impression_el);

}


/*  status update by call back*/
/******************************/
AppMgr.prototype.update_hangout_status = function(event){

	var self = this;

	if(self.first_update_done == false ||   self.hangout_mapping_changed_counter != get_parse_hangout_mapping_data_counter()){
		//var parse_hangout_mapping_array = get_parse_hangout_mapping_data();
		//self.participant_manager_object.set_parseid_hangoutid_mapping(parse_hangout_mapping_array );
		self.participant_manager_object.update_parseid_hangoutid_mapping();
		self.participant_manager_object.update_hangout_participants();	
		self.participant_manager_object.participant_table.UpdateUserObjAll();
    	self.chat_view_model.update();
		self.hangout_mapping_changed_counter = get_parse_hangout_mapping_data_counter();
	}

	if(self.first_update_done == false || self.hangout_speech_status_counter != get_hangout_speech_status_counter()){
		var hangout_speech_status = get_hangout_speech_status();

		self.video_view_model.update_button(hangout_speech_status);
		self.video_view_model.update_speaker(hangout_speech_status);
		self.video_view_model.update_poi_candidate(hangout_speech_status);
		self.hangout_speech_status_counter = get_hangout_speech_status_counter();
	}

	if(self.first_update_done == false || self.game_obj_counter != get_game_obj_counter()){
		
	}


	if( self.transcription_counter != get_transcription_counter()){
    	self.transcription_mgr.update();
    	self.transcription_counter = get_transcription_counter();
    }


	if(self.first_update_done == false || self.parse_data_changed_counter != get_parse_data_changed_counter()){
//	if(true){
		var Game = Parse.Object.extend("Game");
		var game_query = new Parse.Query(Game);
		game_query.include("participants");
		game_query.get(global_debate_game_id, {
		  success: function(actual_game_obj) {
			self.actual_game_obj = actual_game_obj;
			self.participant_manager_object.update_parse_data();
			self.title_view_model.update();
    		self.game_status_mgr.apply_updated_status();

	  		var hangout_speech_status = get_hangout_speech_status();
			self.video_view_model.update_button(hangout_speech_status);
			self.video_view_model.update_speaker(hangout_speech_status);
			self.video_view_model.update_poi_candidate(hangout_speech_status);
			self.chat_view_model.update();
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

	self.participant_manager_object.update_hangout_participants();

	var Game = Parse.Object.extend("Game");
	var game_query = new Parse.Query(Game);
	game_query.include("participants");
	game_query.get(global_debate_game_id, {
	  success: function(actual_game_obj) {
	    self.actual_game_obj = actual_game_obj;
	  	self.participant_manager_object.update_parse_data();
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
			self.impression_mgr.receive_message(message_obj);
		break;
		case "chat":
			self.chat_view_model.receive_message(message_obj, sender_hangout_id);
		break;
	}
}

