
function GeneralConcept_Mgr(){

	var self = this;
	self.argument_context = null;
	self.link_list = new Array();

}

GeneralConcept_Mgr.prototype.initialize = function(general_concept_obj){

	var self = this;
	if(general_concept_obj){

		self.general_concept_obj = general_concept_obj;
		self.ApplyTemplate();

	}else{
		var Comment = Parse.Object.extend("Comment");
		var comment_obj = new Comment();
		comment_obj.set("count", 0);
		var general_concept_param_name = global_team_side + "_general_concept"
		team_discussion_appmgr.actual_game_obj.set(general_concept_param_name, comment_obj);
		team_discussion_appmgr.actual_game_obj.save().then(
			function(obj){
				self.general_concept_obj = comment_obj;
				self.ApplyTemplate();
			},
			function(error) {
				console.log(error);
			}
		);
	}
}



GeneralConcept_Mgr.prototype.update = function(){

	var self = this;

	self.general_concept_obj.fetch({
	  success: function(obj) {
	    self.general_concept_obj = obj;
	    self.general_concept_vm.update(self.general_concept_obj);
	  },
	  error: function(obj, error) {
	    console.log(obj);
	  }
	});

}

GeneralConcept_Mgr.prototype.ApplyTemplate = function(){


	var self = this;
	
	var GeneralConcept_html_Template = _.template($('[data-template="general_concept_template"]').html());
    var generalConcept_element = $("#second_left_second");
    var generalConcept_html_text = GeneralConcept_html_Template();
    generalConcept_element.html(generalConcept_html_text);
    
	self.general_concept_vm = new GeneralConcept_VM();
    var general_concept_el = document.getElementById('second_left_second');
    ko.applyBindings(self.general_concept_vm , general_concept_el);
	self.general_concept_vm.initialize(self.general_concept_obj);

}

