

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
  self.param.event_type = event_JSON.event_type;
  self.param.game_obj_array = event_JSON.game_object_array;

  self.param.event_datetime_obj = event_JSON.event_date_time_obj;
  console.log(self.param.event_datetime_obj);
  var year = self.param.event_datetime_obj.year;
  var month = self.param.event_datetime_obj.month;
  var day = self.param.event_datetime_obj.day;
  var hour = self.param.event_datetime_obj.hour;
  var minutes = self.param.event_datetime_obj.minutes;

  self.param.event_datetime = new Date(year, month, day, hour, minutes);
  console.log("event date time is " + self.param.event_datetime);

  self.count = new Object();
  self.count.number_of_round_created = 0;
  self.event_object = new Object();
  self.game_object_array = new Array();
  self.round_object_array = new Array();

  var Event = Parse.Object.extend("Event");
  var mixidea_event = new Event();
  mixidea_event.set("date_time", self.param.event_datetime);
  mixidea_event.set("title", self.param.event_title);
  mixidea_event.set("type", self.param.event_type);
  mixidea_event.set("description", self.param.event_description);
  console.log("before save");
  mixidea_event.save(null,{
    success: function(obj) {
      console.log("saving event success");

      self.event_object = obj;
      console.log("gambe obj array length is" + self.param.game_obj_array.length);
      if(self.param.game_obj_array.length >0){
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
  mixidea_game.set("date_time", self.param.event_datetime);
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
    var round_obj_for_hierarchy_array = new Array();

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


