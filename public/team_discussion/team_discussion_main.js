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
  self.actual_game_obj = null;


  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      self.actual_game_obj = obj;
      self.preparation_start_time  = self.actual_game_obj.get("prep_start_time");
      self.hangout_id_obj  = self.actual_game_obj.get("hangout_id");
      self.count_timer_start();
      self.show_team_side();
      self.show_hangout_button();
      self.show_video();
		
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



team_dissussion.prototype.show_hangout_button = function(){

  var self = this;  
  var hangout_domain = self.hangout_id_obj.main;

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




team_dissussion.prototype.count_timer_start = function(start_time) {
  var self = this;

  self.timer = setInterval( function(){self.count_timer_show()}, 1000);
}

team_dissussion.prototype.count_timer_show = function() {
  var self = this;
  var current_time = new Date();
  var elapsed_time = current_time - self.preparation_start_time;
  var elapled_second = elapsed_time/1000
  var elapsed_hour = elapled_second/60/60;
  elapsed_hour = Math.floor(elapsed_hour);
  var elapsed_minute = (elapled_second - elapsed_hour*60*60)/60;
  elapsed_minute = Math.floor(elapsed_minute);

  elapled_second = elapled_second - elapsed_hour*60*60 - elapsed_minute*60;
  elapled_second = Math.floor(elapled_second);

  elapled_second = ("0" + elapled_second).slice(-2);
  elapsed_minute = ("0" + elapsed_minute).slice(-2);


  $("span#time_spent").html(elapsed_minute + ":" + elapled_second + " has passed");



}