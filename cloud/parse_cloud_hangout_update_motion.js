Parse.Cloud.define("Cloud_Hangout_update_motion", function(request, response) {
  
  console.log("Cloud_Hangout_update_motion has been called");

  var debate_game_id = request.params.game_id;
  var debate_motion = request.params.debate_motion;
  var user_id = request.params.user_id;
  var authorized = check_user(user_id);
  
  if(authorized){
    new HangoutUpdateMotion(debate_game_id,debate_motion, response);
  }else{
      error_response = {code:1, message: "user is not authorized"};
      response.error(error_response);
  }
  
});

function check_user(user_id){
  
  //check user whether they are participant or not, also need to check current time
  return true;
}


function HangoutUpdateMotion(game_id, str_motion,  response){

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.get(game_id,{
  	success: function(game_obj){
  		game_obj.set("motion", str_motion);
  		game_obj.save(null, {
	          success: function(game_obj) { 
    		      response.success(game_obj);
    		
	          },error: function(myObject, error) {
              error_response = {code:3, message:"saving title failed"};
              response.error(error_response);
	        }
	    });
  	},
  	error: function(myObject, error){
      error_response = {code:4, message:"retrieving game info failed"};
      response.error(error_response);
  	}
  });
}

