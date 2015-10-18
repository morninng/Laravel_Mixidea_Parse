

Parse.Cloud.define("initial_AddConceptObj", function(request, response) {

	var game_id = request.params.game_id;
	var team_name = request.params.team;

	var Game = Parse.Object.extend("Game");
	var game_query = new Parse.Query(Game);
	game_query.get(game_id, {
	  success: function(game_obj) {
	  	var param = team_name + "_general_concept"
	  	var concept_obj = game_obj.get(param);
	  	if(concept_obj){
	  		response.success(game_obj);
	  		return;
	  	}
	  	var Comment = Parse.Object.extend("Comment");
		var new_concept_obj = new Comment();
		new_concept_obj.set("count", 0);
		game_obj.set(param, new_concept_obj);
		game_obj.save().then(
			function(obj){
				response.success(obj);
	  			return;
			},
			function(error) {
				response.error(error);
			}
		);
	  },
	  error: function(object, error) {
		response.error(error);
	  }
	});

});




Parse.Cloud.define("initial_AddArgument", function(request, response) {

	var game_id = request.params.game_id;
	var team_name = request.params.team;

	var Game = Parse.Object.extend("Game");
	var game_query = new Parse.Query(Game);
	game_query.get(game_id, {
	  success: function(game_obj) {
	  	var param = team_name + "_argument"
	  	var argument_obj_array = game_obj.get(param);
	  	if(argument_obj_array){
	  		response.success(game_obj);
	  		return;
	  	}
		var Argument = Parse.Object.extend("Argument");
		var argument_obj_1 = new Argument();
		argument_obj_1.set("main_count",0);
		argument_obj_1.set("title_count",0);
		argument_obj_1.set("title_set", false);
		argument_obj_1.set("main_content_set", false);
		var argument_obj_2 = new Argument();
		argument_obj_2.set("main_count",0);
		argument_obj_2.set("title_count",0);
		argument_obj_2.set("title_set", false);
		argument_obj_2.set("main_content_set", false);
		var param_name = team_name + "_argument";
		game_obj.add(param_name, argument_obj_1);
		game_obj.add(param_name, argument_obj_2);
		game_obj.save().then(
			function(obj){
				response.success(obj);
	  			return;
			},
			function(error) {
				response.error(error);
			}
		);
	  },
	  error: function(object, error) {
		response.error(error);
	  }
	});

});
