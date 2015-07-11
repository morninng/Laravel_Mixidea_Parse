//残す

function ParticipantTableMgr(game_style){

	var self = this;
	self.CreateTableTemplate(game_style);
	self.CreateAudienceTemplate();
	self.create_rolename_array(game_style);	
	for(var i = 0; i< self.role_array.length; i++){
		self.CreateUserObj(self.role_array[i], self.container_array[i]);
		self.UpdateUserObj(self.role_array[i]);
	}

}

ParticipantTableMgr.prototype.CreateUserObj = function(role_name, container_name){
	var self = this;
	eval("self.user_obj_" + role_name + " = new user_status_VM('" + role_name + "');" );
	eval("ko.applyBindings( self.user_obj_" + role_name + " , document.getElementById('" + container_name + "'));" );
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


ParticipantTableMgr.prototype.create_rolename_array = function(game_style){
	
	var self = this;
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
                      "MemberGovernment","MemberOpposition","GovermentWhip","OppositionWhip"];
          	self.container_array = ["PM_Container","LO_Container","DPM_Container","DLO_Container",
                            "MG_Container","MO_Container","GW_Container","OW_Container"];
		break;
	}

	var number_audience = appmgr.participant_manager_object.get_number_of_audience();
	var audience_role_array_full = ["audience1","audience2","audience3","audience4"];
	var audience_container_array_full = ["Audience1_Container","Audience2_Container","Audience3_Container","Audience4_Container"];
	var audience_role_array = audience_role_array_full.slice(0,number_audience);
	var audience_container_array = audience_container_array_full.slice(0,number_audience);

	self.role_array = self.role_array.concat(audience_role_array);
	self.container_array = self.container_array.concat(audience_container_array);

}


ParticipantTableMgr.prototype.CreateAudienceTemplate = function(){

	var number_audience = appmgr.participant_manager_object.get_number_of_audience();
	var audience_data =   [
									{container_name:"Audience1_Container"},
									{container_name:"Audience2_Container"},
									{container_name:"Audience3_Container"},
									{container_name:"Audience4_Container"}
									];

	var audience_data_use = audience_data.slice(0, number_audience);
	var audience_data_template = _.template($('[data-template="audience_list_template"]').html());
	var audience_data_html = audience_data_template({list:audience_data_use});

	$("#audience_list").html(audience_data_html);

}


ParticipantTableMgr.prototype.CreateTableTemplate = function(game_style){

	var participant_table_element = $("#participant_table" );

	switch(game_style){
	  case 'NorthAmerica':
		NA_html_Template = _.template($('[data-template="NA_Template"]').html());
		var NA_html_text = NA_html_Template();
		participant_table_element.html(NA_html_text);
		break;
	  case 'Asian':
		Asian_html_Template = _.template($('[data-template="Asian_Template"]').html());
		var Asian_html_text = Asian_html_Template();
		participant_table_element.html(Asian_html_text);
		break;
	  case 'BP':
		BP_html_Template = _.template($('[data-template="BP_Template"]').html());
		var BP_html_text = BP_html_Template();
		participant_table_element.html(BP_html_text);
		break;
	}
}



