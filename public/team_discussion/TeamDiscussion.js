
 var parse_app_id = "EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX";
 var parse_js_key = "US6Lheio8PGcBdIpwGFhFSQVpi5GKunGf6hGq5Ze";
 Parse.initialize(parse_app_id, parse_js_key);


 var appData = gadgets.views.getParams()['appData'];	
 var appData_split = appData.split("_");

 var global_own_parse_id = appData_split[0];
 var global_debate_game_id = appData_split[1];
 var global_original_hangout_appid = appData_split[2];
 var global_team_side = appData_split[3];
 var global_own_team_side = appData_split[4];
 var global_own_hangout_id = "";

 var user_editable_flag = false
 if(global_team_side == global_own_team_side){
  user_editable_flag = true
 }

 console.log(global_original_hangout_appid);
 console.log(global_debate_game_id);
 console.log(global_own_parse_id);
 console.log(appData);
 console.log(global_team_side);

 var actual_game_obj = new Object();
 var participant_mgr_obj = new TeamDiscussion_ParticipantMgr();
 var discussion_note_obj = new DiscussNoteMgr();

 var discussion_note_setting = {
    Arg:[
        {
          team_name:global_team_side, 
          element:"#argument_pain",
          template:"argument_template",
          comment_query_array:[global_team_side],
          user_editable:user_editable_flag
        }
      ] /*,
    concept:[
        {
          team_name:global_team_side,
          element:"concept_pain",
          template:"concept_template"
        }
      ]*/
  };

window.onload = function(){
  Hangout_Init();
  TeamDiscussion_Init();

}

function TeamDiscussion_Init() {

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.include("participants");
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      actual_game_obj = obj;
      var layout_obj = new ConstructLayout();
      participant_mgr_obj.update();
      discussion_note_obj.initialize(discussion_note_setting);

    },
    error: function(error) {
      alert("something happen and creating event failed" + error.message);
      //data should be vaidated before upload and the error should not happen in server side
    }
  });
}




function Hangout_Init() {
  gapi.hangout.onApiReady.add(function(e){
    console.log("hangout api ready");
    if(e.isApiReady){
      global_own_hangout_id = gapi.hangout.getLocalParticipantId();
      console.log("own hangout id " + global_own_hangout_id);


    	gapi.hangout.data.onStateChanged.add(function(event) {
          discussion_note_obj.update_hangout_status(event);   
        });

      gapi.hangout.onParticipantsChanged.add(function(participant_change) {
          participant_mgr_obj.participants_change();
      });
    }
  });
}

