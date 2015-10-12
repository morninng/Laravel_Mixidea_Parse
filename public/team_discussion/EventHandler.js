
function EventHandler(){
	self = this;
  self.show_AddArgument();
  self.handleEvents();
}

EventHandler.prototype.handleEvents = function(){
  var self = this;
  self.$el_add_argument_container = $("#second_right_third");
  self.$el_add_argument_container.on("click","#add_argument", function(e){self.click_add_argument();});
}

EventHandler.prototype.show_AddArgument = function(){
  
  var self = this;
  if(global_team_side == global_own_team_side){
    $("#second_right_third").html("<button id='add_argument'> Add Argument</button>");
  }
}


EventHandler.prototype.hideAddArgument = function(){
  var self = this;
  $("#second_right_third").html(null);
}


EventHandler.prototype.click_add_argument = function(){

  var self = this; 

  self.hideAddArgument();

  var Argument = Parse.Object.extend("Argument");
  var argument_obj = new Argument();
  argument_obj.set("main_count",0);
  argument_obj.set("title_count",0);

  var param_name = global_team_side + "_argument";
  actual_game_obj.add(param_name, argument_obj);
  actual_game_obj.save().then(
    function(obj){
////////////counter managmenet////
      util_send_argument_counter(argument_obj,"main",global_team_side, null);
////////////counter managmenet////
    },
    function(error) {
        // saving the object failed.
    }
  );
}





