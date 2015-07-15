

 var parse_app_id = "EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX";
 var parse_js_key = "US6Lheio8PGcBdIpwGFhFSQVpi5GKunGf6hGq5Ze";
 Parse.initialize(parse_app_id, parse_js_key);

 var container_modelview = new ContainerMainAppViewModel();
 ko.applyBindings(container_modelview);
 var appData = gadgets.views.getParams()['appData'];	
 console.log(appData);
 var appData_split = appData.split("_");
 var global_own_parse_id = appData_split[0];
 var global_debate_game_id = appData_split[1];
 var global_own_hangout_id = "";
 var appmgr = new AppMgr(global_debate_game_id, global_own_parse_id);


function Mixidea_init(){


  Parse.Cloud.run('Cloud_GetHangoutGameData_debate', { game_id: global_debate_game_id},{
    success: function(game_obj) {
    update_own_state(global_own_hangout_id, global_own_parse_id);
 		appmgr.initialize(game_obj, global_own_hangout_id);
    },
    error: function(error) {
      alert("something happen and creating event failed" + error.message);
      //data should be vaidated before upload and the error should not happen in server side
    }
  });
}

function update_own_state(){
  var parse_hangout_mapping = get_parse_hangout_mapping_data();
  var parse_hangout_mapping_update = new Array();

  for(var i=0; i<parse_hangout_mapping.length; i++){
    if(parse_hangout_mapping[i].parse_id != global_own_parse_id){
      parse_hangout_mapping_update.push(parse_hangout_mapping[i]);
    }
  }

  
  var own_mapping_data = new Object();
  own_mapping_data["parse_id"] = global_own_parse_id;
  own_mapping_data["hangout_id"] = global_own_hangout_id;
  parse_hangout_mapping_update.push(own_mapping_data);


  var parse_hangout_mapping_str_update = JSON.stringify(parse_hangout_mapping_update);

  var hangout_mapping_counter = get_parse_hangout_mapping_data_counter();
  hangout_mapping_counter++;
  var hangout_mapping_counter_str = String(hangout_mapping_counter);

  gapi.hangout.data.submitDelta({
      "parse_hangout_mapping": parse_hangout_mapping_str_update,
      "parse_hangout_mapping_counter": hangout_mapping_counter_str
  });

}

function Hangout_Init() {

  gapi.hangout.onApiReady.add(function(e){
    console.log("hangout api ready");
    if(e.isApiReady){
      global_own_hangout_id = gapi.hangout.getLocalParticipantId();
    	Mixidea_init();
    	gapi.hangout.data.onStateChanged.add(function(event) {
    	  	// mixidea_object.UpdateMixideaStatus(event);
          appmgr.update_hangout_status(event);

        });

        gapi.hangout.onParticipantsChanged.add(function(participant_change) {
          // mixidea_object.ParticipantsChanged(participant_change);
          appmgr.participants_change(participant_change);
        });

        gapi.hangout.data.onMessageReceived.add(function(received_message) {
          // mixidea_object.receive_message(received_message);
          appmgr.receive_message(received_message);
        });
    }
  });
}