
Parse.Cloud.define("Cloud_CreateEvent", function(request, response) {

  var str_event_obj = request.params.event_obj;
  var event_JSON = JSON.parse(str_event_obj);
  new Create_Event(request, response, event_JSON);

});

// this event creation is for creating a online event where only one game exist in one round.
//the tournament style of event creation function, multiple game exist in one round, should be implemented later.

function Create_Event(request, response, event_JSON){

  console.log("create event is called");
  var self = this;
  self.param = new Object();
  self.param.event_title = event_JSON.event_title;
  self.param.event_description = event_JSON.event_description;
  self.param.event_date = event_JSON.event_date;
  self.param.event_time = event_JSON.event_time;
  self.param.event_type = event_JSON.event_type;
  self.param.game_obj_array = event_JSON.game_object_array;
  console.log(self.param.game_obj_array);
  self.count = new Object();
  self.count.number_of_round_created = 0;
  self.event_object = new Object();
  self.game_object_array = new Array();
  self.round_object_array = new Array();

  var Event = Parse.Object.extend("Event");
  var mixidea_event = new Event();
//  mixidea_event.set("date_time", self.param.event_date);
  mixidea_event.set("title", self.param.event_title);
  mixidea_event.set("type", self.param.event_type);
  mixidea_event.set("description", self.param.event_description);
  console.log("before save");
  mixidea_event.save(null,{
    success: function(obj) {
      console.log("saving event success");

      self.event_object = obj;
      console.log("gambe obj array length is" + self.param.game_obj_array.length);
      if(self.param.game_obj_array.length >1){
        for(var i=0; i< self.param.game_obj_array.length; i++){
          console.log("before calling create round game");
          self.create_round_game(request, response,i);
        }
      }else{
        error_response = {code:6, message:"game object is not defined"};
        response.error(error_response);     
      }
    },
    error: function(obj, error){
      error_response = {code:6, message:"saving event data failed"};
      response.error(error_response);
    }
  });
}

Create_Event.prototype.create_round_game = function(request, response,i){

  console.log("create round game is called i=" +i);
  var self = this;

  var Game = Parse.Object.extend("Game");
  var mixidea_game = new Game();
  mixidea_game.set("style", self.param.game_obj_array[i].style);
  mixidea_game.set("type", self.param.event_type);
  mixidea_game.set("gernre", self.param.game_obj_array[i].genre);
  mixidea_game.set("motion", self.param.game_obj_array[i].motion);
//  mixidea_game.set("date_time", self.param.event_date);
  mixidea_game.set('parent_event', self.event_object.id);
  console.log("before calling saving mixidea game ")

  mixidea_game.save().then(function(game_obj){

    console.log( " game has been created");
    console.log( i + "th game has been created");
    self.game_object_array[i] = game_obj;

    var Round = Parse.Object.extend("Round");
    var mixidea_round = new Round();  
    mixidea_round.add("game",self.game_object_array[i].id);
    mixidea_round.set('parent_event', self.event_object.id);
    return mixidea_round.save();
  }).then(function(round_obj){
    self.round_object_array[i] = round_obj;
    console.log( i + "th round has been created :" + self.round_object_array[i]);
    console.log("number of game is " + self.param.game_obj_array.length);

    self.count.number_of_round_created++;
    if(self.count.number_of_round_created == self.param.game_obj_array.length){
      console.log("i when create event hierararchy is called is" + i);
      self.create_event_hierarchy(request, response, i);
    }

  }), function(error) {
    error_response = {code:6, message:"saving game or round failed"};
    response.error(error_response);
  };
}


Create_Event.prototype.create_event_hierarchy = function(request, response, n){

    var self = this;
    console.log("create_event_hierarchy is called, number of round is" + n);
    var round_obj_for_hierarchy_array = new Object();
    var event_obj_for_hierarchy = new Object();
    var round_obj_array = new Array();
    var game_obj_array = new Array();

    for(var i=0; i<self.round_object_array.length; i++){
      console.log("round obj length is " + self.round_object_array.length);
      var game_obj_id = self.game_object_array[i].id;
      var str_game_style = self.game_object_array[i].get("style");
      console.log("str_game_style is " +str_game_style);
      var game_obj_for_hierarchy = new Object();
      game_obj_for_hierarchy = {game_ID: game_obj_id, style: str_game_style};
      var game_obj_for_hierarchy_array = new Array();
      game_obj_for_hierarchy_array.push(game_obj_for_hierarchy);
      game_obj_array.push(game_obj_id);
      console.log("game obj id is" + game_obj_id);

      var round_obj_for_hierarchy = new Object();
      round_obj_for_hierarchy = {round_ID: self.round_object_array[i].id , game_array: game_obj_for_hierarchy_array};
      round_obj_for_hierarchy_array = new Array();
      round_obj_array.push(self.round_object_array[i].id );
      console.log("round obj id is" + self.round_object_array[i].id );
      round_obj_for_hierarchy_array.push(round_obj_for_hierarchy);
    }

    event_obj_for_hierarchy = {round_array : round_obj_for_hierarchy_array};
    self.event_object.set("event_hierarchy", event_obj_for_hierarchy);
    self.event_object.set("round", round_obj_array);
    self.event_object.set("game", game_obj_array);

    self.event_object.save().then(function(event_obj){
      self.event_object = event_obj;
      console.log("event object saved again");
      response.success(event_obj);
    }), function(error) {
      console.log("error happen during setting event hierarchy" + error);
    };

}




Parse.Cloud.define("CancelGame", function(request, response) {
  console.log("cancel game called");
  var self = this;
  self.game_id = request.params.game_id;
  self.game_obj = new Object();
  self.user = request.user;
  self.user_id = self.user.id;
  self.role_name = request.params.role;
  self.parent_event_obj = new Object();
  console.log("user id is" + self.user_id );
  console.log("game id is" + self.game_id);
  console.log("role name is" + self.role_name);

  var error_response = {code:1, message: "default_message", game_obj: self.game_obj};
  // 1: default message
  // 3: game do not exist
  // 4: event do not exist
  // 5: failure to save game data
  // 6: contradiction situation to cancel the role
  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.get(self.game_id, {
    success: function(game_obj){
      var attendance = null;
      self.game_obj = game_obj;
      console.log("game obj is" + self.game_obj.id);
      self.parent_event_obj_id  = self.game_obj.get("parent_event");
      console.log("parent event obj is " + self.parent_event_obj_id);
      var participant_obj = self.game_obj.get("participant_role");
      console.log("participant fole obj is " + participant_obj)
      if(participant_obj){
        attendance = participant_obj[self.role_name];
        console.log("attendance is " + attendance);
        if(attendance && attendance==self.user_id){

          delete participant_obj[self.role_name];
          self.game_obj.set("participant_role", participant_obj);
          self.game_obj.save().then(function(){
            decrement_event_participant(request, response, self.parent_event_obj_id, self.user, self.game_obj);
          },function(error){
            error_response = {code:5, message: "failure to save game data", game_obj: self.game_obj};
            response.error(error_response);
          });
        }else{
          error_response = {code:6, message: "contradiction situation to cancel the role", game_obj: self.game_obj};
          response.error(error_response);
        }
      }
    },
    error: function(error){
      error_response = {code:3, message: "game do not exist", game_obj: self.game_obj};
      response.error(error_response);
    }
  });
});


function decrement_event_participant(request, response, event_id, user, game_obj){
  console.log(" event participant data remove");

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
      var participated = true;
      participant_array = event_obj.get("participants");
      if(participant_array){
        console.log("user id is" + self.user_id);
        for(var key in participant_array ){
          console.log("registered key is" + key);
          if(key == self.user_id){
            participant_array[key]--;
            if(participant_array[key] < 1){
              delete participant_array.key;
              var game_participate = self.user.relation("game_participate");
              game_participate.remove(self.game_obj);
              var event_participate = self.user.relation("event_participate");
              event_participate.remove(event_obj);
            }
          }
        }
      }
      event_obj.set("participants", participant_array);
      event_obj.save().then(function(obj){
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
      error_response = {code:4, message: "event do not exist", game_obj: game_obj_str};
      response.error(error_response_str);
    }
  });
};

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
      error_response = {code:4, message: "event do not exist", game_obj: game_obj_str};
      response.error(error_response_str);
    }
  });
};

