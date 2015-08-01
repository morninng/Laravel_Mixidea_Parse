 var parse_app_id = "EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX";
 var parse_js_key = "US6Lheio8PGcBdIpwGFhFSQVpi5GKunGf6hGq5Ze";
 Parse.initialize(parse_app_id, parse_js_key);


 var appData = gadgets.views.getParams()['appData'];	
 console.log(appData);
 var appData_split = appData.split("_");
 var global_own_parse_id = appData_split[0];
 console.log(global_own_parse_id);
 var global_debate_game_id = appData_split[1];
 console.log(global_debate_game_id);
 var global_original_hangout_appid = appData_split[2];
 console.log(global_original_hangout_appid);
 var global_team_side = appData_split[3];
 console.log(global_team_side);

  window.onload = Team_Discussion_Init; 



function Team_Discussion_Init() {
  gapi.hangout.onApiReady.add(function(e){
    console.log("hangout api ready");
    if(e.isApiReady){
    	new team_dissussion();
    }
  });
}

function team_dissussion() {

	var self = this;
	self.preparation_start_time = null;
	self.main_hangout_url = null;
  self.game_obj = null;

  Parse.Cloud.run('Cloud_GetHangoutGameData_debate', { game_id: global_debate_game_id},{
    success: function(game_obj) {
      console.log("game data retrieve success");
      console.log(game_obj);
      self.game_obj = game_obj;
   		self.preparation_start_time  = "";
   		self.show_hangout_button();
   		self.show_timer();
      self.show_video();
      self.show_team_side();
    },
    error: function(error) {
      alert("something happen and creating event failed" + error.message);
      //data should be vaidated before upload and the error should not happen in server side
    }
  });

}

team_dissussion.prototype.show_video = function(){
  
  var self = this;
  console.log("show video");

  self.canvas = gapi.hangout.layout.getVideoCanvas();

  offset = $("span#video_area").offset()
  var offset_y = offset.top + 5;

  self.feed = gapi.hangout.layout.getDefaultVideoFeed();
  self.canvas.setVideoFeed(self.feed);
  self.canvas.setWidth(400);
  self.canvas.setPosition(10,offset_y);
  self.canvas.setVisible(true);

}


team_dissussion.prototype.show_team_side = function(){
  
  var self = this;
  console.log("show team side")
  $("span#team_category").html("<strong>" + global_team_side + "</strong>");
  
}

team_dissussion.prototype.show_timer = function(){
	
  var self = this;
  console.log("show timer")
}

team_dissussion.prototype.show_hangout_button = function(){

  var self = this;  


  var hangout_id_obj = self.game_obj.hangout_ids;
  var hangout_domain = hangout_id_obj.main;

  var hangout_query_key = "&gd=";
  var hangout_query_value = "?gid=";
  var hangout_gid = "?gid=";
  var hangout_query_split = "_";

  var first_query_value = global_own_parse_id;
  var second_query_value = global_debate_game_id;
  var thierd_query_value = global_original_hangout_appid;

  var hangout_link_str= hangout_domain + hangout_gid + global_original_hangout_appid + hangout_query_key
         + first_query_value + hangout_query_split + second_query_value
          + hangout_query_split +thierd_query_value;

  var data = {hangout_link: hangout_link_str};
  var Hangout_html_Template = _.template($('[data-template="Hangout_button_Template"]').html());
  var HangoutButton_html_text = Hangout_html_Template( data );
  var hangout_container = $("#goback_hangout_area");
  hangout_container.append(HangoutButton_html_text);

}