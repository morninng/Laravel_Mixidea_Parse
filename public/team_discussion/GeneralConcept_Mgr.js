
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

		var req_obj = new Object();
		req_obj["team"] = global_team_side;
		req_obj["game_id"] = global_debate_game_id;
		Parse.Cloud.run('initial_AddConceptObj', req_obj, {
		  success: function(game_obj) {
			  var param = global_team_side + "_general_concept"
			  self.general_concept_obj = game_obj.get(param);
			  self.ApplyTemplate();
		  },
		  error: function(error) {
		  	  console.log(error);
		  }
		});

/*		var Comment = Parse.Object.extend("Comment");
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
				console.log("general concept initialization failed" + error);
			}
		);
		*/
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
	    console.log("fetchign general concept has been failed");
	  }
	});

}

GeneralConcept_Mgr.prototype.update_edit_status = function(){
	var self = this;

	self.general_concept_vm.update_edit_status();
	self.general_concept_vm.show_concept();
}


GeneralConcept_Mgr.prototype.ApplyTemplate = function(){


	var self = this;
	var GeneralConcept_html_Template = _.template($('[data-template="general_concept_template"]').html());
    var generalConcept_element = $("#general_concept_pain");
    var generalConcept_html_text = GeneralConcept_html_Template();
    generalConcept_element.html(generalConcept_html_text);
	self.general_concept_vm = new GeneralConcept_VM();
    var general_concept_el = document.getElementById('general_concept_pain');
    ko.applyBindings(self.general_concept_vm , general_concept_el);
	self.general_concept_vm.initialize(self.general_concept_obj);
}

