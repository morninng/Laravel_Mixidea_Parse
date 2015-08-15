
function GeneralConcept_Mgr(){

	var self = this;
	self.argument_context = null;
	self.link_list = new Array();

}

GeneralConcept_Mgr.prototype.initialize = function(parse_id){

	var self = this;
	if(parse_id){
		var Comment = Parse.Object.extend("Comment");
		var comment_query = new Parse.Query(Comment);
		comment_query.get(parse_id,{
			success: function(obj){
				self.general_concept_obj = obj;
				self.ApplyTemplate();
			},
			error: function(){
				console.log("error to get data");
			}
		});

	}else{
		var Comment = Parse.Object.extend("Comment");
		var comment_obj = new Comment();
		var param_name = global_team_side + "_general_concept"
		team_discussion_appmgr.actual_game_obj.set(param_name, comment_obj);
		team_discussion_appmgr.actual_game_obj.save().then(
			function(obj){
				var general_concept = obj.get(param_name);
				var general_concept_id = general_concept.id
				var Comment = Parse.Object.extend("Comment");
				var comment_query = new Parse.Query(Comment);
				comment_query.get(general_concept_id,{
					success: function(obj){
						self.general_concept_obj = obj;
						self.ApplyTemplate(obj);
					},
					error: function(){

					}
				});
			},
			function(error) {
			    // saving the object failed.
			}
		);
	}
}

GeneralConcept_Mgr.prototype.ApplyTemplate = function(parse_id){


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

