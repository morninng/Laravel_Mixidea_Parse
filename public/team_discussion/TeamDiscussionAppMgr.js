
function TeamDiscussAppMgr() {

  var self = this;

  self.arg_id_list = new Array();
  self.argument_mgr = new Argument_Mgr();
  self.general_concept_mgr = new GeneralConcept_Mgr();

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  var param_name = global_team_side + "_argument";
  game_query.include(param_name);
  game_query.include("participants");
  game_query.get(global_debate_game_id, {
    success: function(obj) {

      self.actual_game_obj = obj;
      var general_concept = self.actual_game_obj.get(global_team_side +"_general_concept");
      var argument_obj_array = self.actual_game_obj.get(global_team_side +"_argument");
      
      self.participant_mgr_obj = new TeamDiscussion_ParticipantMgr();   
      self.participant_mgr_obj.update();


      if(general_concept)
        self.general_concept_mgr.initialize(general_concept.id);
      else{
        self.general_concept_mgr.initialize(null);
      }

      if(argument_obj_array){
        self.argument_mgr.initialize(argument_obj_array);
      }else{
        self.argument_mgr.initialize(null);
      }

      self.show_team_side();
      self.show_motion();
      self.showHangoutButton();
      self.count_timer_start();
    
    },
    error: function(error) {
      alert("something happen and creating event failed" + error.message);
      //data should be vaidated before upload and the error should not happen in server side
    }
  });
}



TeamDiscussAppMgr.prototype.update_hangout_status = function(event){
  var self = this;

}

TeamDiscussAppMgr.prototype.participants_change = function(participant_change){
  var self = this;
}

TeamDiscussAppMgr.prototype.update_argument_from_server = function(){

  var self = this;

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  var param_name = global_team_side + "_argument";
  game_query.include(param_name);
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      console.log(obj);
      var argument_obj_array = self.actual_game_obj.get(global_team_side +"_argument");
      self.argument_mgr.update_server_argument_data(argument_obj_array);
    },
    error: function(obj, error) {
      console.log(error);
    }
  });
}


TeamDiscussAppMgr.prototype.show_motion = function(){
  var self = this;
  motion  = self.actual_game_obj.get("motion");
  var motion_element = $("#game_motion");
  motion_element.html(motion);
 
}

TeamDiscussAppMgr.prototype.showHangoutButton = function(){
  var self = this;
  var hangout_id_obj  = self.actual_game_obj.get("hangout_id");

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

  var hangout_link = "<a class='event_hangout_button'  target='_blank' style='text-decoration:none;' href='" + 
        hangout_link_str + 
        "'><img src='https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png' style='border:0;width:100px;height:24px'/></a>";


  var hangout_element = $("#hangout_button");
  hangout_element.html(hangout_link);

}



TeamDiscussAppMgr.prototype.count_timer_start = function(start_time) {
  var self = this;

  self.preparation_start_time  = self.actual_game_obj.get("prep_start_time");
  self.timer = setInterval( function(){self.count_timer_show()}, 1000);

}

TeamDiscussAppMgr.prototype.count_timer_show = function() {
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


TeamDiscussAppMgr.prototype.show_team_side = function(){
  
  var self = this;
  console.log("show team side")
  $("span#team_category").html("<strong>" + global_team_side + "</strong>");
}



