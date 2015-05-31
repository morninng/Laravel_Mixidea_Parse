
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("JoinGame", function(request, response) {

  console.log("join game called");
  var self = this;
  self.game_id = request.params.game_id;
  self.game_obj = new Object();
  self.user = request.user;
  self.user_id = self.user.id;
  self.role_name = request.params.role;
  self.parent_event_obj = new Object();
  console.log(self.game_id);

  var error_response = {code:1, message: "default_message", game_obj: self.game_obj};
  // 1: default message
  // 2: other user have already joined with this role
  // 3: game do not exist
  // 4: event do not exist
  // 5: failure to save game data



  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.get(self.game_id, {
    success: function(game_obj){
      var attendance= null;
      self.game_obj = game_obj;
      console.log("game obj is" + self.game_obj.id);
      self.parent_event_obj_id  = self.game_obj.get("parent_event");
      console.log("parent event obj is " + self.parent_event_obj_id);
      var attendance = null;
      var participant_obj = self.game_obj.get("participant_role");

      if(participant_obj){
        attendance = participant_obj[role_name];
      }else{
        participant_obj = new Object();
      }
      
      if(attendance){
        error_response = {code:2, message: "other user have already joined as " + role_name, game_obj: self.game_obj};
        response.error(error_response);

      }else{
        participant_obj[role_name] = self.user_id;
        self.game_obj.set("participant_role", participant_obj); // add users as a participant
        self.game_obj.save().then(function(obj){
          console.log("game object saved");
          self.game_obj = obj;
          increment_event_participant(request, response, self.parent_event_obj_id, self.user, self.game_obj);
        },function(error){
          error_response = {code:5, message: "failure to save game data", game_obj: self.game_obj};
          response.error(error_response);
        });
      }
    },
    error: function(object, error) {
      error_response = {code:3, message: "game do not exist", game_obj: self.game_obj};
      response.error(error_response);
    }
  });
});

function increment_event_participant(request, response, event_id, user, game_obj){

  console.log(" event participant data add");
  var self = this;
  self.game_obj = game_obj;
  self.user = user;
  self.user_id = user_id;

  var Event = Parse.Object.extend("Event");
  var event_query = new Parse.Query(Event);
  console.log(event_id);

  event_query.get(event_id, {
    success: function(event_obj){
      console.log("event retrieve success");


      var participant_array = null;
      var already_participated = false;
    	participant_array = event_obj.get("participants");
      if(participant_array){
        console.log("user id is" + self.user_id);
    	  for(var key in participant_array ){
          console.log("registered key is" + key);
    	    if(key == self.user_id){
    	      participant_array[key]++;
    	      already_participated = true;
    	    }
    	  }
        if(!already_participated){
          participant_array[self.user_id] = 1;
          console.log("user id is" + self.user_id);
        }
      }else{
       participant_array = new Object();
       console.log("user id is" + self.user_id);
       participant_array[self.user_id] = 1;
      }
    	event_obj.set("participants", participant_array);
    	event_obj.save().then(function(obj){
        console.log("event data saved");
        console.log(self.game_obj);
        var game_participate = self.user.relation("game_participate");
        game_participate.add(self.game_obj);
        var event_participate = self.user.relation("event_participate");
        event_participate.add(event_obj);
        return self.user.save();
      }).then(function(obj){
        console.log("saving user relation success");
        response.success(self.game_obj);
      },function(error){
        console.log("saving game is failed or saving user data failed");
        error_response = {code:5, message: "failure to save game data", game_obj: self.game_obj};
        response.error(error_response);
      });
    },
    error: function(object, error) {
      console.log("retrieving event object failed");
      var game_obj_str = JSON.stringify(self.game_obj);
      error_response = {code:4, message: "event do not exist", game_obj: game_obj_str};
      var error_response_str = JSON.stringify(error_response);
      response.error(error_response_str);
    }
  });
};

