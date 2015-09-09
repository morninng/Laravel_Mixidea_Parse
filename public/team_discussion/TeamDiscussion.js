
 var parse_app_id = "EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX";
 var parse_js_key = "US6Lheio8PGcBdIpwGFhFSQVpi5GKunGf6hGq5Ze";
 Parse.initialize(parse_app_id, parse_js_key);


 var appData = gadgets.views.getParams()['appData'];	
 var appData_split = appData.split("_");

 var global_own_parse_id = appData_split[0];
 var global_debate_game_id = appData_split[1];
 var global_original_hangout_appid = appData_split[2];
 var global_team_side = appData_split[3];
 var global_own_hangout_id = "";

 console.log(global_original_hangout_appid);
 console.log(global_debate_game_id);
 console.log(global_own_parse_id);
 console.log(appData);
 console.log(global_team_side);

 team_discussion_appmgr = new TeamDiscussAppMgr();

 window.onload = Hangout_Init;

function Hangout_Init() {
  gapi.hangout.onApiReady.add(function(e){
    console.log("hangout api ready");
    if(e.isApiReady){
      global_own_hangout_id = gapi.hangout.getLocalParticipantId();
      console.log("own hangout id " + global_own_hangout_id);
      //team_discussion_appmgr.update_edit_status();

    	gapi.hangout.data.onStateChanged.add(function(event) {

          team_discussion_appmgr.update_hangout_status(event);
          
        });
        gapi.hangout.onParticipantsChanged.add(function(participant_change) {

          team_discussion_appmgr.participants_change(participant_change);

        });
    }
  });
}

