Parse.Cloud.define("Cloud_GetHangoutGameData_debate", function(request, response) {

  var debate_game_id = request.params.game_id;
  new HangoutDebateDataRetrieve(debate_game_id, response);
  
});



function HangoutDebateDataRetrieve(game_id, response){
  console.log("--------hangout debate game called------");
  
  var self = this;
  self.count = 0;
  self.role_count = 0;
  self.game_id = game_id;
//  var game_id = request.params.game_id;
  self.game_response_obj = new Object();
  self.debater_data_retrieve_complete = false;
  self.audience_data_retrieve_complete = false;
  
  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);

  game_query.get(game_id, {
    success: function(game_obj){
      self.game_obj = game_obj;
      self.game_response_obj.game_title = game_obj.get("motion");
      self.game_response_obj.game_style = game_obj.get("style");
      self.game_response_obj.hangout_ids = game_obj.get("hangout_id");
      self.game_response_obj.debater_data_array = new Array(); 
      self.game_response_obj.audience_data_array = new Array();
      self.RetrieveDebaterData(response);
      self.RetrieveAudienceData(response);
    },
    error: function(object, error) {
        error_response = {code:1, message:"game object is not found"};
        response.error(error_response);  
    }
  });
}


HangoutDebateDataRetrieve.prototype.RetrieveDebaterData = function(response){

  var self = this;
  var participant_obj = self.game_obj.get("participant_role");

  if(!participant_obj){
    self.debater_data_retrieve_complete =true;
    self.Check_And_Return_Data();
    return;
  }
  self.role_count = Object.keys(participant_obj).length;
  if(self.role_count ==0){
    self.debater_data_retrieve_complete =true;
    self.Check_And_Return_Data();
    return;
  }


  for(var key in participant_obj ){
    var user_parse_id = participant_obj[key];
    self.game_response_obj.debater_data_array.push({ role:key, parse_id:user_parse_id });
    var User = Parse.Object.extend("User");
    var user_query = new Parse.Query(User);
    user_query .get(user_parse_id, {
      success: function(user_obj){
        for(var j=0; j<self.game_response_obj.debater_data_array.length; j++ ){
          if(self.game_response_obj.debater_data_array[j].parse_id == user_obj.id){
            self.game_response_obj.debater_data_array[j].first_name = user_obj.get("FirstName");
            self.game_response_obj.debater_data_array[j].last_name = user_obj.get("LastName");
            self.game_response_obj.debater_data_array[j].pict_src= user_obj.get("Profile_picture");
          }
        }
        self.count ++;
        if(self.count == self.role_count){
         self.debater_data_retrieve_complete =true;
         self.Check_And_Return_Data(response);
        }
      },
      error: function(object, error) {
        error_response = {code:2, message:" debater user object is not found"};
        response.error(error_response);
      }
    });
  }
}

HangoutDebateDataRetrieve.prototype.RetrieveAudienceData = function(response){

  var self = this;
  var audience_obj_array = self.game_obj.get("audience_participants");
  var audience_count = 0

  if(!audience_obj_array){
    self.audience_data_retrieve_complete =true;
    self.Check_And_Return_Data();
    return;
  }else if(audience_obj_array.length ==0){
    self.audience_data_retrieve_complete =true;
    self.Check_And_Return_Data();
    return;
  }


  for(var i=0; i<audience_obj_array.length; i++ ){
    num =i+1;
    eval("var role_name = 'audience" + num + "'");
    console.log(role_name);
    var user_parse_id = audience_obj_array[i];
    self.game_response_obj.audience_data_array.push({ role:role_name, parse_id:user_parse_id })

    var User = Parse.Object.extend("User");
    var user_query = new Parse.Query(User);
    user_query .get(user_parse_id, {
       success: function(user_obj){
        for(var j=0; j<self.game_response_obj.audience_data_array.length; j++ ){
          if(self.game_response_obj.audience_data_array[j].parse_id == user_obj.id){
            self.game_response_obj.audience_data_array[j].first_name = user_obj.get("FirstName");
            self.game_response_obj.audience_data_array[j].last_name = user_obj.get("LastName");
            self.game_response_obj.audience_data_array[j].pict_src = user_obj.get("Profile_picture");
          }
        }
        audience_count++;
        if(audience_count ==audience_obj_array.length){
         self.audience_data_retrieve_complete =true;
         self.Check_And_Return_Data(response);
        }
       },
       error: function(object, error){
        error_response = {code:2, message:"audience user object is not found"};
        response.error(error_response);
       }
     });
  }
}


HangoutDebateDataRetrieve.prototype.Check_And_Return_Data = function(response){

  var self = this;
  if(self.debater_data_retrieve_complete && self.audience_data_retrieve_complete){
    console.log("all data retrieval success");
    response.success(self.game_response_obj);
  }

}


