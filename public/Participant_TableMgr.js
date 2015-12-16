
function ParticipantTableMgr(){
	var self = this;
	self.role_array = new Array();
	self.table_set_style = null;
	self.attached_el = null;
	self.table_exist = false;

}


ParticipantTableMgr.prototype.update_table_from_server = function(){

	var self = this;
	if(!self.table_exist){
		return;
	}
	self.update_table();

}

ParticipantTableMgr.prototype.update_table = function(el_name){

	var self = this;


	var style = actual_game_obj.get("style");
	if(!self.table_exist || style != self.table_set_style){
		self.remove_table();
		self.UpdateTableTemplate(el_name);
		self.create_rolename_array();	

		for(var i = 0; i< self.role_array.length; i++){
			self.CreateUserObj(self.role_array[i], self.container_array[i]);
		}
		self.table_exist = true;
	}
	self.UpdateUserObjAll();

	self.table_set_style  = style;
}

ParticipantTableMgr.prototype.remove_table = function(){

	var self = this;

	if(!self.table_exist){
		return;
	}

	for(var i = 0; i< self.role_array.length; i++){
		var role_container_name = self.container_array[i];
		var role_container_el = document.getElementById(role_container_name);
		ko.cleanNode(role_container_el);
		var role_name =  self.role_array[i];
		eval("self.user_obj_" + role_name + " = null;");
	}

	var participant_table_element = $(self.attached_el);
	participant_table_element.html(null);
	self.table_exist = false;

}


ParticipantTableMgr.prototype.CreateUserObj = function(role_name, container_name){
	var self = this;
	eval("self.user_obj_" + role_name + " = new user_status_VM('" + role_name + "');" );
	eval("ko.applyBindings( self.user_obj_" + role_name + " , document.getElementById('" + container_name + "'));" );
}


ParticipantTableMgr.prototype.UpdateUserObjAll = function(){
	var self = this;
	for(var i = 0; i< self.role_array.length; i++){
		self.UpdateUserObj(self.role_array[i]);
	}
}


ParticipantTableMgr.prototype.UpdateUserObj = function(role_name){
	var self = this;
	eval("self.user_obj_" + role_name + ".update_user_status();");
}



ParticipantTableMgr.prototype.UserObj_EnableButton_All = function(){
	var self = this;
	for(var i = 0; i< self.role_array.length; i++){
		eval("self.user_obj_" + self.role_array[i] + ".enable_change(true);" );
	}
}

//残す
ParticipantTableMgr.prototype.UserObj_DisableButton_All = function(){
	var self = this;
	for(var i = 0; i< self.role_array.length; i++){
		eval("self.user_obj_" + self.role_array[i] + ".enable_change(false);" );
	}
}


ParticipantTableMgr.prototype.create_rolename_array = function(){
	
	var self = this;

	var game_style = actual_game_obj.get("style");

	switch(game_style){
	  case 'NorthAmerica':
		self.role_array = ["PrimeMinister","LeaderOpposition","MemberGovernment","MemberOpposition","ReplyPM","LOReply"];
		self.container_array = ["PM_Container","LO_Container","MG_Container","MO_Container","PMR_Container","LOR_Container"];
		break;
	  case 'Asian':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "GovernmentWhip","OppositionWhip","GovermentReply","OppositionReply"];
                self.container_array = ["PM_Container","LO_Container","DPM_Container","DLO_Container",
                            "GW_Container","OW_Container","GR_Container","OR_Container"];
		break;
	  case 'BP':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "MemberGovernment","MemberOpposition","GovernmentWhip","OppositionWhip"];
          	self.container_array = ["PM_Container","LO_Container","DPM_Container","DLO_Container",
                            "MG_Container","MO_Container","GW_Container","OW_Container"];
		break;
	}

	var number_audience = participant_mgr_obj.get_number_of_audience();
	var audience_role_array_full = ["audience1","audience2","audience3","audience4","audience5",
																	"audience6","audience7","audience8","audience9","audience10"];
	var audience_container_array_full = ["Audience1_Container","Audience2_Container","Audience3_Container","Audience4_Container","Audience5_Container"
	,"Audience6_Container","Audience7_Container","Audience8_Container","Audience9_Container","Audience10_Container"];

	self.role_array = self.role_array.concat(audience_role_array_full);
	self.container_array = self.container_array.concat(audience_container_array_full);

}





ParticipantTableMgr.prototype.UpdateTableTemplate = function(el_name){

	var self = this;


	var game_style = actual_game_obj.get("style");

	var participant_table_element = $(el_name);
	self.attached_el = el_name;
	var audience_data =   [
									{container_name:"Audience1_Container"},
									{container_name:"Audience2_Container"},
									{container_name:"Audience3_Container"},
									{container_name:"Audience4_Container"},
									{container_name:"Audience5_Container"},
									{container_name:"Audience6_Container"},
									{container_name:"Audience7_Container"},
									{container_name:"Audience8_Container"},
									{container_name:"Audience9_Container"},
									{container_name:"Audience10_Container"}
									];


	switch(game_style){
	  case 'NorthAmerica':
		NA_html_Template = _.template($('[data-template="NA_Template"]').html());
		var NA_html_text = NA_html_Template({list:audience_data});
		participant_table_element.html(NA_html_text);
		break;
	  case 'Asian':
		Asian_html_Template = _.template($('[data-template="Asian_Template"]').html());
		var Asian_html_text = Asian_html_Template({list:audience_data});
		participant_table_element.html(Asian_html_text);
		break;
	  case 'BP':
		BP_html_Template = _.template($('[data-template="BP_Template"]').html());
		var BP_html_text = BP_html_Template({list:audience_data});
		participant_table_element.html(BP_html_text);
		break;
	}
}



