function Title_VM_wrapper(){
	var self = this;
	self.title_VM_editable = null;
	self.title_VM_fixed = false;
	self.title_editable_el = null;
}

Title_VM_wrapper.prototype.update_from_server = function(){
	var self = this;
	if(!self.title_VM_editable){
		return
	}
	self.title_VM_editable.update();
}

Title_VM_wrapper.prototype.remove_editable = function(){

	var self = this;
	if(!self.title_VM_editable){
		return;
	}
	ko.cleanNode(self.title_editable_el);
	self.title_element.html(null);
	self.title_VM_editable = null;
	self.title_editable_el = null;
}

Title_VM_wrapper.prototype.update_editable = function(el_name){

	var self = this;

	if(!self.title_VM_editable){

		self.title_VM_editable = new title_VM();
	  var Title_html_Template = _.template($('[data-template="title_template_editable"]').html());
	  self.title_element = $(el_name);
	  var Title_html_text = Title_html_Template();
	  self.title_element.html(Title_html_text);
	  self.title_editable_el = document.getElementById('title_template_area');
	  ko.applyBindings(self.title_VM_editable, self.title_editable_el);
	}
	self.title_VM_editable.update();
}

Title_VM_wrapper.prototype.update_fixed_title = function(el_name){

	var self = this;
	var title_str = actual_game_obj.get("motion");

	if(!self.title_VM_fixed){
		self.title_VM_fixed = true;
	  var Title_html_Template = _.template($('[data-template="title_template_fixed"]').html());
	  var title_element = $(el_name);
	  var Title_html_text = Title_html_Template({motion:title_str});
	  title_element.html(Title_html_text);
	}
}

Title_VM_wrapper.prototype.remove_fixed_title = function(el_name){

	var self = this;
	if(!self.title_VM_fixed){
		return;
	}

	var title_element = $(el_name);
	title_element.html(null);
	self.title_VM_fixed = false;


}




function title_VM(){

	var self = this;
	self.title_show = ko.observable(false); 
	self.title_sentence = ko.observable();
	self.title_input = ko.observable(false); 
	self.title_value = ko.observable();
	self.title_width = ko.observable();
	self.title_count = 0;
}



title_VM.prototype.update = function(){

	var self = this;
	self.title_show(true);
	var title = actual_game_obj.get("motion");

	self.title_sentence(title);
	var title_width = $("#event_title_show_out").width();
	var title_width_str = "width:" + String(title_width) + "px"
	self.title_width(title_width_str);
	self.title_input(false);
	self.title_value(title);

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
  var update_motion_obj = { game_id: global_debate_game_id, debate_motion: title_sentence,user_id: global_own_parse_id };
 
  Parse.Cloud.run('Cloud_Hangout_update_motion', update_motion_obj,{
    success: function(actual_game_obj) {
	    var title = actual_game_obj.get("motion");
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

}


title_VM.prototype.update_title_server = function(){



}


