
function GeneralConcept_VM(){

	var self = this;
	self.argument_context = null;
	self.link_url_array = ko.observableArray();
  	self.content_visible = ko.observable(false); 
  	self.input_visible = ko.observable(false); 
  	self.content_text = ko.observable(); 
  	self.content_text_input = ko.observable();
}

GeneralConcept_VM.prototype.initialize = function(general_concept_obj){

	var self = this;
	self.general_concept_obj = general_concept_obj;
	self.show_retrieved_data();


}

GeneralConcept_VM.prototype.show_retrieved_data = function(general_concept_obj){

	var self = this;
	var context = self.general_concept_obj.get("context");
  	if(context){
  		self.content_text_input(context);
  		self.content_text(context);
  		self.content_visible(true);
  		self.input_visible(false);
	}else{
  		self.content_visible(false);
  		self.input_visible(true);
	}

	var link_list = self.general_concept_obj.get("link");
	self.link_url_array(link_list);

}


GeneralConcept_VM.prototype.update_data_from_server = function(general_concept_obj){

	var self = this;
	self.general_concept_obj.fetch({
	  success: function(obj) {
	  	self.general_concept_obj =obj;
		self.show_retrieved_data();
	  },
	  error: function(obj, error) {
	  	console.log("error");
	  }
	});


}


GeneralConcept_VM.prototype.click_edit_concept = function(general_concept_obj){

	var self = this;

	console.log("click edit");
  	self.content_visible(false);
  	self.input_visible(true);

}

GeneralConcept_VM.prototype.click_cancel_concept = function(general_concept_obj){

	console.log("click edit");

}

GeneralConcept_VM.prototype.click_save_concept = function(general_concept_obj){

	var self = this;

	console.log("click save");
	var context = self.content_text_input();
	console.log(context);
	self.general_concept_obj.set("context", context);
	self.general_concept_obj.save(null, {
	  success: function(obj) {
	    console.log("saved");
	    self.update_data_from_server();
	  },
	  error: function(obj, error) {
	    alert('Failed to create new object, with error code: ' + error.message);

	  }
	});


}