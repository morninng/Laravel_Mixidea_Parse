
function Argument_Mgr(){

	var self = this;
	self.Argument_list = new Array();
	self.general_concept_id = null;
	self.definition = null;
	self.team_side = null;
	self.current_type = null;

}



Argument_Mgr.prototype.create_argument = function(){

	var self = this;

	var Argument = Parse.Object.extend("Argument");
	var argument_obj_1 = new Argument();
	var argument_obj_2 = new Argument();
	var param_name = global_team_side + "_argument";
	team_discussion_appmgr.actual_game_obj.add(param_name, argument_obj_1);
	team_discussion_appmgr.actual_game_obj.add(param_name, argument_obj_2);
	team_discussion_appmgr.actual_game_obj.save().then(
		function(obj){
			var argument_obj_array = obj.get(param_name);
			for(var i=0; i< argument_obj_array.length; i++){
				argument_id = argument_obj_array[i].id;
				self.get_argument_obj_createVM(argument_id, i);
			}
		},
		function(error) {
		    // saving the object failed.
		}
	);
}


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

Argument_Mgr.prototype.initialize = function(argument_pointer_array, team_side, current_type){

	var self = this;
	if(argument_pointer_array){
		for(var i=0; i< argument_pointer_array.length; i++){
			argument_id = argument_pointer_array[i].id;
			self.get_argument_obj_createVM(argument_id, i);
		}
	}else{
		self.create_argument();
	}

}



Argument_Mgr.prototype.ApplyTemplate = function(obj, argument_id, order_num){

	var self = this; 
	console.log("apply template")
	order_num++;
	console.log(order_num);
	var element_selector_str = "#argument_list .argument_child:nth-child(" + order_num + ")";
	var Argument_html_Template = _.template($('[data-template="argument_template"]').html());
	var argument_element = $(element_selector_str);
    //var argument_element = $("#argument_list");
    console.log(argument_element);

    var data = {Argument_ID:argument_id};
    var argument_html_text = Argument_html_Template(data);
    console.log(argument_html_text);

  //  argument_list_element.append(argument_html_text);
    argument_element.html(argument_html_text);
    
    eval("self.argument_vm_" + argument_id + "= new Argument_VM();");
    var element_name = 'Arg_' + argument_id;
    var argument_el = document.getElementById(element_name);
    
    ko.applyBindings(eval("self.argument_vm_" + argument_id) , argument_el);
	eval("self.argument_vm_" + argument_id + ".initialize(obj)");
	

}



Argument_Mgr.prototype.update = function(){

	//データ再取得
	//　self.Argument_listにないものがあったら、
	//ArgumentContextを作成
	
	// update objectで、変更されたObjectの名前を受け取り、それを変更
	//カウンタで、同期済みのものと、同期していないものを区別し、同期済みの配列のうち、ユニークなものを更新
	//  
	

}


