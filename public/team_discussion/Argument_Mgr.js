
function Argument_Mgr(setting){

	var self = this;
	self.setting = setting;
	self.team_name = setting.team_name; //このチーム名は、自分のチーム名ではなく、Argumentを発信したteam_name
	self.element = setting.element;
	self.template = setting.template;
	self.user_editable = setting.user_editable;
	self.comment_query_team_array = setting.comment_query_array;

  self.argument_param_name = self.team_name + "_argument";

	self.existing_Argument_list = new Array();
	self.argument_game_obj = new Object();

}




Argument_Mgr.prototype.initialize = function(){

  var self = this;

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.include(self.argument_param_name);

	game_query.get(global_debate_game_id, {
		success: function(obj) {
			self.argument_game_obj = obj;
			var argument_obj_array = self.argument_game_obj.get(self.argument_param_name);
			if(argument_obj_array){
				for(var i=0; i< argument_obj_array.length; i++){
					self.ApplyTemplate(argument_obj_array[i], argument_obj_array[i].id, i);
				}
			}else{
				var req_obj = new Object();
				req_obj["team"] = self.team_name;
				req_obj["game_id"] = global_debate_game_id;

				Parse.Cloud.run('initial_AddArgument', req_obj, {
				  success: function(game_obj) {

						var param = self.team_name + "_argument"
						var arguments_array = game_obj.get(param);
						util_send_argument_counter(arguments_array[0],"main",self.team_name, null);
				  },
				  error: function(error) {
						console.log(error);
				  }
				});
			}
		}
	});
}


Argument_Mgr.prototype.remove_all = function(){

	var self = this;

	for(var i=0; i< self.existing_Argument_list.length; i++){
	  var element_name = 'Arg_' + self.existing_Argument_list[i];
	  var argument_el = document.getElementById(element_name);
	  ko.cleanNode(argument_el);
	}

}



Argument_Mgr.prototype.ApplyTemplate = function(obj, argument_id, order_num){

	var self = this; 
	self.existing_Argument_list.push(argument_id);
	console.log("apply template");
	order_num++;
	var template_name = "[data-template='" +  self.template + "']";
	var Argument_html_Template = _.template($(template_name).html());
  var argument_element = $(self.element);
  var data = {Argument_ID:argument_id};
  var argument_html_text = Argument_html_Template(data);
  argument_element.append(argument_html_text);
    
  eval("self.argument_vm_" + argument_id + "= new Argument_VM();");
  var element_name = 'Arg_' + argument_id;
  var argument_el = document.getElementById(element_name);
    
  ko.applyBindings(eval("self.argument_vm_" + argument_id) , argument_el);
	eval("self.argument_vm_" + argument_id + ".initialize(obj, self.setting)");
	

}
Argument_Mgr.prototype.addArgument = function(){

	var self = this; 
	var Argument = Parse.Object.extend("Argument");
	var argument_obj = new Argument();
	argument_obj.set("main_count",0);
	argument_obj.set("title_count",0);
	argument_obj.set("title_set", false);
	argument_obj.set("main_content_set", false);

	var param_name = self.team_name + "_argument";
	self.argument_game_obj.add(param_name, argument_obj);
	self.argument_game_obj.save().then(
		function(obj){
////////////counter managmenet////
			util_send_argument_counter(argument_obj,"main",self.team_name, null);
////////////counter managmenet////
		},
		function(error) {
		    // saving the object failed.
		}
	);
}

Argument_Mgr.prototype.update_argument_from_server = function(){

  var self = this;

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  var param_name = self.team_name + "_argument";
  game_query.include(param_name);
  game_query.get(global_debate_game_id, {
    success: function(obj) {
      self.argument_game_obj = obj;    	
      var argument_obj_array = self.argument_game_obj.get(self.argument_param_name);


			for(var i=0; i< argument_obj_array.length; i++){
				var exist = false;
				for(var j=0; j< self.existing_Argument_list.length; j++){
					if(argument_obj_array[i].id == self.existing_Argument_list[j]){
						exist = true;
					}
				}
				if(!exist){
					self.ApplyTemplate(argument_obj_array[i], argument_obj_array[i].id, 0);
				}else{
					var argument_vm_obj = eval("self.argument_vm_" + argument_obj_array[i].id);
					argument_vm_obj.apply_argument_data_from_server(argument_obj_array[i]);
				}
			}
		},
		error: function(obj, error) {
			console.log(error);
			console.log("update argument from server failed");
    }
  });
}


Argument_Mgr.prototype.update_comment_data_from_server = function(argument_id){

	var self = this;
	console.log("update comment data from server argumentid is" + argument_id);

	if(self.existing_Argument_list.indexOf(argument_id) !== -1){
		eval("self.argument_vm_" + argument_id + ".apply_comment_data_from_server()");
	}
}



Argument_Mgr.prototype.update_edit_status = function(){

	var self = this;
	for(var i=0; i< self.existing_Argument_list.length; i++){
		eval("self.argument_vm_" + self.existing_Argument_list[i] + ".update_edit_status();");
		eval("self.argument_vm_" + self.existing_Argument_list[i] + ".show_context();");
	}

}