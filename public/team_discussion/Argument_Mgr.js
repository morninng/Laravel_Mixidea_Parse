
function Argument_Mgr(){

	var self = this;
	self.existing_Argument_list = new Array();
	self.definition = null;
	self.team_side = null;
	self.current_type = null;

}



Argument_Mgr.prototype.create_argument = function(){

	var self = this;



	var Argument = Parse.Object.extend("Argument");
	var argument_obj_1 = new Argument();
	argument_obj_1.set("main_count",0);
	argument_obj_1.set("title_count",0);
	var argument_obj_2 = new Argument();
	argument_obj_2.set("main_count",0);
	argument_obj_2.set("title_count",0);
	var param_name = global_team_side + "_argument";
	team_discussion_appmgr.actual_game_obj.add(param_name, argument_obj_1);
	team_discussion_appmgr.actual_game_obj.add(param_name, argument_obj_2);
	team_discussion_appmgr.actual_game_obj.save().then(
		function(obj){

			team_discussion_appmgr.actual_game_obj = obj;
			team_discussion_appmgr.update_argument_from_server();

			/*
			var argument_obj_array = obj.get(param_name);
			for(var i=0; i< argument_obj_array.length; i++){
				argument_id = argument_obj_array[i].id;
				self.get_argument_obj_createVM(argument_id, i);
			}*/
			/*
			self.ApplyTemplate(argument_obj_1, argument_obj_1.id, 0);
			self.ApplyTemplate(argument_obj_2, argument_obj_2.id, 1);
			*/

		},
		function(error) {
		    // saving the object failed.
		}
	);
}

/*
Argument_Mgr.prototype.get_argument_obj_createVM = function(argument_id, order_num){

	var self = this;

	var Argument = Parse.Object.extend("Argument");
	var argument_query = new Parse.Query(Argument);
	argument_query.get(argument_id,{
		success: function(obj){
			self.argument_obj = obj;
			self.ApplyTemplate(obj, argument_id, order_num);
		},
		error: function(){
			console.log("error");
		}
	});
}
*/

Argument_Mgr.prototype.initialize = function(argument_obj_array, team_side, current_type){

	var self = this;
	if(argument_obj_array){
		for(var i=0; i< argument_obj_array.length; i++){
			self.ApplyTemplate(argument_obj_array[i], argument_obj_array[i].id, i);
		}
	}else{

		var req_obj = new Object();
		req_obj["team"] = global_team_side;
		req_obj["game_id"] = global_debate_game_id;

		Parse.Cloud.run('initial_AddArgument', req_obj, {
		  success: function(game_obj) {
			var param = global_team_side + "_argument"
			var arguments_array = game_obj.get(param);
			team_discussion_appmgr.actual_game_obj = game_obj;
			team_discussion_appmgr.update_argument_from_server();
		  },
		  error: function(error) {
		  	  console.log(error);
		  }
		});



	}

}



Argument_Mgr.prototype.ApplyTemplate = function(obj, argument_id, order_num){

	var self = this; 
	self.existing_Argument_list.push(argument_id);
	console.log("apply template");
	order_num++;
	var Argument_html_Template = _.template($('[data-template="argument_template"]').html());
    var argument_element = $("#argument_list");
    var data = {Argument_ID:argument_id};
    var argument_html_text = Argument_html_Template(data);
    argument_element.append(argument_html_text);
    
    eval("self.argument_vm_" + argument_id + "= new Argument_VM();");
    var element_name = 'Arg_' + argument_id;
    var argument_el = document.getElementById(element_name);
    
    ko.applyBindings(eval("self.argument_vm_" + argument_id) , argument_el);
	eval("self.argument_vm_" + argument_id + ".initialize(obj)");
	

}
Argument_Mgr.prototype.addArgument = function(){

	var self = this; 
	var Argument = Parse.Object.extend("Argument");
	var argument_obj = new Argument();

	var param_name = global_team_side + "_argument";
	team_discussion_appmgr.actual_game_obj.add(param_name, argument_obj);
	team_discussion_appmgr.actual_game_obj.save().then(
		function(obj){
			team_discussion_appmgr.actual_game_obj = obj;
			team_discussion_appmgr.update_argument_from_server();
/*
			team_discussion_appmgr.actual_game_obj = obj;
			console.log(argument_obj.id);
			argument_obj_array = team_discussion_appmgr.actual_game_obj.get(param_name);
			argument_order = argument_obj_array.length;
			self.ApplyTemplate(argument_obj, argument_obj.id, argument_order);
*/
			// self.get_argument_obj_createVM(argument_obj.id, argument_order);
		},
		function(error) {
		    // saving the object failed.
		}
	);
}


Argument_Mgr.prototype.update_server_argument_data = function(argument_obj_array){

	//データ再取得
	//　self.Argument_listにないものがあったら、
	//ArgumentContextを作成
	
	// update objectで、変更されたObjectの名前を受け取り、それを変更
	//カウンタで、同期済みのものと、同期していないものを区別し、同期済みの配列のうち、ユニークなものを更新

	var self = this;
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
}


Argument_Mgr.prototype.update_comment_data_from_server = function(argument_id){

	var self = this;
	eval("self.argument_vm_" + argument_id + ".apply_comment_data_from_server()");
}

Argument_Mgr.prototype.update_edit_status = function(){

	var self = this;
	for(var i=0; i< self.existing_Argument_list.length; i++){
		eval("self.argument_vm_" + self.existing_Argument_list[i] + ".update_edit_status();");
		eval("self.argument_vm_" + self.existing_Argument_list[i] + ".show_title();");
		eval("self.argument_vm_" + self.existing_Argument_list[i] + ".show_main_content();");
	}

}