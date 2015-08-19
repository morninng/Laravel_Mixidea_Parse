


function TeamDiscussAppMgr() {

  var self = this;

  self.arg_id_list = new Array();
  self.argument_mgr = new Argument_Mgr();
  self.general_concept_mgr = new GeneralConcept_Mgr();

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  var param_name = global_team_side + "_argument";
  game_query.include(param_name);
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      self.actual_game_obj = obj;
      var general_concept = self.actual_game_obj.get(global_team_side +"_general_concept");
      var argument_obj_array = self.actual_game_obj.get(global_team_side +"_argument");
      
    //  argument_mgr.initialize(general_concept_id, definition, self.argument_id_array, global_team_side, "team_disucussion");
      if(general_concept)
        self.general_concept_mgr.initialize(general_concept.id);
      else{
        self.general_concept_mgr.initialize(null);
      }

      if(argument_obj_array){
        self.argument_mgr.initialize(argument_obj_array);
/*
        for(var i=0; i< argument_id_array.length; i++){
          var argument_id = argument_id_array[i];
          self.arg_id_list.push(argument_id);
          eval("self.arg_obj_" + argument_id) = 
          self.argument_mgr.initialize(argument_id);
*/

      }else{
        self.argument_mgr.initialize(null);
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



TeamDiscussAppMgr.prototype.update_argument_from_server = function(){

  var self = this;

  self.actual_game_obj.fetch({
    success: function(obj) {
      console.log(obj);
      var argument_obj_array = self.actual_game_obj.get(global_team_side +"_argument");
      self.argument_mgr.update_serverdata(argument_obj_array);

    },
    error: function(obj, error) {
    }
  });

}
