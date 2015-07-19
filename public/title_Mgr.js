function title_VM(){

	var self = this;
	self.title_show = ko.observable(false); 
	self.title_sentence = ko.observable();
	self.title_input = ko.observable(false); 
	self.title_value = ko.observable();
	self.title_width = ko.observable();
	self.title_count = 0;
}

title_VM.prototype.initialize = function(game_id, game_obj,own_parse_id){

	var self = this;
	self.title_show(true);
	var title = game_obj.game_title;
	self.title_sentence(title);
	var title_width = $("#event_title_show_out").width();
	var title_width_str = "width:" + String(title_width) + "px"
	self.title_width(title_width_str);
	self.title_input(false);
	self.title_value(title);
	self.title_count = 1;
	self.game_id = game_id;
	self.own_parse_id = own_parse_id;

}

title_VM.prototype.update = function(game_obj){

	var self = this;
	self.title_show(true);
	var title = game_obj.game_title;
	self.title_sentence(title);
	var title_width = $("#event_title_show_out").width();
	var title_width_str = "width:" + String(title_width) + "px"
	self.title_width(title_width_str);
	self.title_input(false);
	self.title_value(title);
	self.title_count++;

}




title_VM.prototype.activate_updating_title = function(){

	var self = this;
	self.title_show(false);
	self.title_input(true);

}
title_VM.prototype.cancel_updating_title = function(){

	var self = this;
	self.title_show(true);
	self.title_input(false);

}

title_VM.prototype.send_title = function(){

  var self = this;
  var title_sentence = document.forms.title_form.event_title_input.value;
  var update_motion_obj = { game_id: self.game_id, debate_motion: title_sentence,user_id: self.own_parse_id };
 
  Parse.Cloud.run('Cloud_Hangout_update_motion', update_motion_obj,{
    success: function(game_obj) {
	        var title = game_obj.get("motion");
	        self.title_sentence(title);
		    self.title_show(true);
		    self.title_input(false);

			var parse_data_counter = get_parse_data_changed_counter();
			if(!parse_data_counter){
				parse_data_counter = 0;
			}
			parse_data_counter++;
			parse_data_counter_str = String(parse_data_counter);
		    gapi.hangout.data.submitDelta({
			        "parse_data_changed_counter":parse_data_counter_str
			});


    },
    error: function(error) {
      alert("something happen and creating event failed" + error.message);
      //data should be vaidated before upload and the error should not happen in server side
    }
  });


/*

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.get(self.game_id,{
  	success: function(game_obj){

  		game_obj.set("motion", title_sentence);
  		game_obj.save(null, {
	      success: function(game_obj) { 
	        var title = game_obj.get("motion");
	        self.title_sentence(title);
		    self.title_show(true);
		    self.title_input(false);
	      },error: function(myObject, error) {
	        console.log(error)
	      }
	    });

  	},
  	error: function(myObject, error){
  		console.log(error);
  	}
  });
*/



}


title_VM.prototype.update_title_server = function(){



}


