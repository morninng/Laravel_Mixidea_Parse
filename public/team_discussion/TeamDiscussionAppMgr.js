


function TeamDiscussAppMgr() {

  var self = this;

  self.argument_mgr = new Argument_Mgr();
  self.general_concept_mgr = new GeneralConcept_Mgr();

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      self.actual_game_obj = obj;
      var general_concept = self.actual_game_obj.get(global_team_side +"_general_concept");
      var argument_id_array = self.actual_game_obj.get(global_team_side +"Arguments");
      
    //  argument_mgr.initialize(general_concept_id, definition, self.argument_id_array, global_team_side, "team_disucussion");
      if(general_concept)
        self.general_concept_mgr.initialize(general_concept.id);
      else{
        self.general_concept_mgr.initialize(null);
      }


      /*
      self.preparation_start_time  = self.actual_game_obj.get("prep_start_time");
      self.hangout_id_obj  = self.actual_game_obj.get("hangout_id");
      self.count_timer_start();
      self.show_team_side();
      self.show_hangout_button();
      self.show_video();
      */
    
    },
    error: function(error) {
      alert("something happen and creating event failed" + error.message);
      //data should be vaidated before upload and the error should not happen in server side
    }
  });

}
