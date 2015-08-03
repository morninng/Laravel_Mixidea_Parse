
function ParticipantMgr(){

	var self = this;
	self.debater_obj_array = new Array();
	self.audience_obj_array = new Array();
	self.game_style = null;
	self.own_parse_id = null;
	self.own_hangout_id = null;
	self.parse_hangout_idmapping_array = new Object();
}

ParticipantMgr.prototype.initialize = function(game_obj, parse_user_id, hangout_id){

	var self = this;
	self.debater_obj_array = game_obj.debater_data_array;
	self.audience_obj_array = game_obj.audience_data_array;
	self.game_style = game_obj.game_style;
	self.own_parse_id = parse_user_id;
	self.own_hangout_id = hangout_id;
	self.update_hangout_participants();
	self.setGameData();
	self.participant_table = new ParticipantTableMgr(self.game_style);

}

ParticipantMgr.prototype.is_your_own_hangoutid = function(in_hangout_id){
	var self = this;
	if(!in_hangout_id){
		return false;
	}

	if(in_hangout_id == self.own_hangout_id){
		return true;
	}
	return false;
}


ParticipantMgr.prototype.retrieve_own_group_hangoutid_array = function(){

	var self = this;
	var my_role_array = self.get_own_role_array();
	var my_role = my_role_array[0];
	var my_group = self.role_group_array[my_role];

	var same_group_role_array = new Array();
	var same_role_hangoutid_array = new Array();

	for(var key in self.role_group_array ){
		if(self.role_group_array[key] ==  my_group){
			var role_name = key;
			var hangout_id = get_hangout_id(role_name);
			same_role_hangoutid_array.push(hangout_id);
		}
	}
	return same_role_hangoutid_array;
}


ParticipantMgr.prototype.get_own_group_name = function( ){

	var self = this;

	own_role_array = new Array();
	own_role_array = self.get_own_role_array();
	
	own_group = self.getRoleGroup(own_role_array[0]);

	return own_group;
}

ParticipantMgr.prototype.update_parse_data = function(game_obj ){

	var self = this;
	self.debater_obj_array = game_obj.debater_data_array;
	self.audience_obj_array = game_obj.audience_data_array;
	self.participant_table.UpdateUserObjAll();

}


ParticipantMgr.prototype.update_game_status = function(game_status){

	var self = this;
	switch(game_status){
		case 1:
		case 2:
		case 3:
			self.participant_table.UserObj_EnableButton_All();
		break;
		case 4:
		case 5:
			self.participant_table.UserObj_DisableButton_All();
		break;
	}
}

//participant changed eventが呼ばれたときに、毎回呼び出す。

ParticipantMgr.prototype.update_hangout_participants = function(){
	var self = this;

	var participant_id_array = new Array();
	var participant_obj_array = gapi.hangout.getParticipants();

	for( var i=0; i < participant_obj_array.length; i++){
		participant_id_array.push(participant_obj_array[i].id);
	}
	self.participant_id_array = participant_id_array;

}


ParticipantMgr.prototype.update_parseid_hangoutid_mapping = function(){
	var self = this;
	var parse_hangout_mapping_array = get_parse_hangout_mapping_data();
	self.parse_hangout_idmapping_array = parse_hangout_mapping_array;
}
/*
ParticipantMgr.prototype.set_parseid_hangoutid_mapping = function(parse_hangout_mapping){
	var self = this;
	self.parse_hangout_idmapping_array = parse_hangout_mapping;
}
*/

ParticipantMgr.prototype.refresh_serverdata = function(game_id){
	
}

ParticipantMgr.prototype.setGameData = function(){

	var self = this;
	var game_style = self.game_style;
	
	switch(game_style){
	  case 'NorthAmerica':
		self.role_array = ["PrimeMinister","LeaderOpposition","MemberGovernment","MemberOpposition","ReplyPM","LOReply","Audince1","Audince2","Audince3","Audince4"];
		self.role_group_array = {PrimeMinister:"Gov",LeaderOpposition:"Opp",MemberGovernment:"Gov",MemberOpposition:"Opp",ReplyPM:"Gov",LOReply:"Opp",audience1:"Aud",audience2:"Aud",audience3:"Aud",audience4:"Aud"};
		break;
	  case 'Asian':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "GovernmentWhip","OppositionWhip","GovermentReply","OppositionReply","Audince1","Audince2"];
		self.role_group_array = {PrimeMinister:"Gov",LeaderOpposition:"Opp",DeptyPrimeMinister:"Gov",DeptyLeaderOpposition:"Opp",GovernmentWhip:"Gov",OppositionWhip:"Opp",ReplyPM:"Gov",LOReply:"Opp",audience1:"Aud",audience2:"Aud"};
		break;
	  case 'BP':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "MemberGovernment","MemberOpposition","GovermentWhip","OppositionWhip","Audince1","Audince2"];
		self.role_group_array = {PrimeMinister:"OG",LeaderOpposition:"OO",DeptyPrimeMinister:"OG",DeptyLeaderOpposition:"OO",MemberGovernment:"CG",MemberOpposition:"CO",GovermentWhip:"CG",OppositionWhip:"CO",audience1:"Aud",audience2:"Aud"};
		break;
	}
}


ParticipantMgr.prototype.get_all_rolename_array = function(){
  var self = this;
  return self.role_array;
}


ParticipantMgr.prototype.get_role_array = function(hangout_id){

	var self = this;

	var parse_id = self.getParseID_fromHangoutID(hangout_id);
	var role_array = new Array();

	for(var i=0; i< self.debater_obj_array.length; i++){
	  if(self.debater_obj_array[i].parse_id == parse_id){
	    role_array.push(self.debater_obj_array[i].role)
	  }
	}
	for(var i=0; i< self.audience_obj_array; i++){
	  if(self.audience_obj_array[i].parse_id == parse_id){
	    role_array.push(self.audience_obj_array[i].role)
	  }
	}
	
	return role_array;

}

ParticipantMgr.prototype.get_number_of_audience = function(){

	var self = this;
	return self.audience_obj_array.length;
}


ParticipantMgr.prototype.get_own_role_array = function(){

	var self = this;
	var role_array = new Array();
	
	role_array = self.get_role_array(self.own_hangout_id);
	return role_array;
}


ParticipantMgr.prototype.getFirstName_fromParseID = function(parse_id){

	var self = this;

	for( var i=0; i<self.debater_obj_array.length; i++){
		if(self.debater_obj_array[i].parse_id == parse_id){
			var name = self.debater_obj_array[i].first_name;
			return name;
		}
	}
	for( var i=0; i<self.audience_obj_array.length; i++){
		if(self.audience_obj_array[i].parse_id == parse_id){
			var name = self.audience_obj_array[i].first_name;
			return name;
		}
	}
	return null;

}

ParticipantMgr.prototype.getFirstName_fromHangoutID = function(hangout_id){

	var self = this;
	var parse_id = self.getParseID_fromHangoutID(hangout_id);

	for( var i=0; i<self.debater_obj_array.length; i++){
		if(self.debater_obj_array[i].parse_id == parse_id){
			var name = self.debater_obj_array[i].first_name;
			return name;
		}
	}
	for( var i=0; i<self.audience_obj_array.length; i++){
		if(self.audience_obj_array[i].parse_id == parse_id){
			var name = self.audience_obj_array[i].first_name;
			return name;
		}
	}
	return null;
}


ParticipantMgr.prototype.getName_fromHangoutID = function(hangout_id){

	var self = this;
	var parse_id = self.getParseID_fromHangoutID(hangout_id);

	for( var i=0; i<self.debater_obj_array.length; i++){
		if(self.debater_obj_array[i].parse_id == parse_id){
			var name = self.debater_obj_array[i].first_name + " " + self.debater_obj_array[i].last_name;
			return name;
		}
	}
	for( var i=0; i<self.audience_obj_array.length; i++){
		if(self.audience_obj_array[i].parse_id == parse_id){
			var name = self.audience_obj_array[i].first_name + " " + self.audience_obj_array[i].last_name;
			return name;
		}
	}
	return null;
}

ParticipantMgr.prototype.getPictSrc_fromHangoutID = function(hangout_id){

	var self = this;
	var parse_id = self.getParseID_fromHangoutID(hangout_id);

	for( var i=0; i<self.debater_obj_array.length; i++){
		if(self.debater_obj_array[i].parse_id == parse_id){
			var pict_src = self.debater_obj_array[i].pict_src;
			return pict_src;
		}
	}
	for( var i=0; i<self.audience_obj_array.length; i++){
		if(self.audience_obj_array[i].parse_id == parse_id){
			var pict_src = self.audience_obj_array[i].pict_src;
			return pict_src;
		}
	}
	return null;
}

ParticipantMgr.prototype.getParseID_fromHangoutID = function(hangout_id){

	var self = this;
	var parse_id = null;
	
	for(var i=0; i< self.parse_hangout_idmapping_array.length; i++){
		if(self.parse_hangout_idmapping_array[i].hangout_id == hangout_id){
		  parse_id = self.parse_hangout_idmapping_array[i].parse_id;
		}
	}
	return parse_id;
}



ParticipantMgr.prototype.getRoleGroup = function(role_name){
	var self = this;
	if(!role_name){
		return null;
	}

	role_group_name = self.role_group_array[role_name];
	return role_group_name;
}

ParticipantMgr.prototype.isYourPartner = function(hangout_id){

	var self = this;
	if(!hangout_id){
		return false;
	}

	own_role_array = new Array();
	own_role_array = self.get_own_role_array();
	others_role_array = new Array();
	others_role_array = self.get_role_array(hangout_id);
	
	own_group = self.getRoleGroup(own_role_array[0]);
	others_group = self.getRoleGroup(others_role_array[0]);
	
	if(own_group == others_group){
		return true
	}
	return false;
	//ロールを取得で比較	
}


ParticipantMgr.prototype.isAudience_yourself = function(){

	var self = this;
	for(var i=0; i< self.audience_obj_array.length; i++){
	  if(self.audience_obj_array[i].parse_id == self.own_parse_id){
	    return true;
	  }
	}
	return false;
}


ParticipantMgr.prototype.isDebater_yourself = function(){	

	var self = this;

	for(var i=0; i< self.debater_obj_array.length; i++){
	  if(self.debater_obj_array[i].parse_id == self.own_parse_id ){
	  	return true;
	  }
	}
	return false;	
}

ParticipantMgr.prototype.getUserPictureSrc = function(role_name){

	var self = this;
	for(var i=0; i< self.debater_obj_array.length; i++){
	  if(self.debater_obj_array[i].role == role_name){
	    return self.debater_obj_array[i].pict_src;
	  }
	}
	for(var i=0; i <self.audience_obj_array.length; i++){
	  if(self.audience_obj_array[i].role == role_name){
	    return self.audience_obj_array[i].pict_src;
	  }
	}
	return null;
}

ParticipantMgr.prototype.getUserFirstName = function(role_name){

	var self = this;
	for(var i=0; i< self.debater_obj_array.length; i++){
	  if(self.debater_obj_array[i].role == role_name){
	    return self.debater_obj_array[i].first_name;
	  }
	}
	for(var i=0; i <self.audience_obj_array.length; i++){
	  if(self.audience_obj_array[i].role == role_name){
	    return self.audience_obj_array[i].first_name;
	  }
	}
	return null;
}



ParticipantMgr.prototype.getUserFullName = function(role_name){

	var self = this;
	for(var i=0; i< self.debater_obj_array.length; i++){
	  if(self.debater_obj_array[i].role == role_name){
	    return self.debater_obj_array[i].first_name + self.debater_obj_array[i].last_name;
	  }
	}
	for(var i=0; i <self.audience_obj_array.length; i++){
	  if(self.audience_obj_array[i].role == role_name){
	    return self.debater_obj_array[i].first_name + self.debater_obj_array[i].last_name;
	  }
	}
	return null;
}


ParticipantMgr.prototype.get_hangout_id = function(role_name){
	var self = this;
	var parse_id = self.getParseID_fromRole(role_name);
	for(var i=0; i<self.parse_hangout_idmapping_array.length; i++){
		if( self.parse_hangout_idmapping_array[i].parse_id == parse_id){
			return self.parse_hangout_idmapping_array[i].hangout_id;
		}
	}
	return null;
}

ParticipantMgr.prototype.getParseID_fromRole = function(role_name){
	var self = this;
	for(var i=0; i< self.debater_obj_array.length; i++){
		if(self.debater_obj_array[i].role == role_name){
			return self.debater_obj_array[i].parse_id;
		}
	}
	for(var i=0; i< self.audience_obj_array.length; i++){
		if(self.audience_obj_array[i].role == role_name){
			return self.audience_obj_array[i].parse_id;
		}
	}
	return null;
}



ParticipantMgr.prototype.is_Login = function(role_name){
	var self = this;
	var hangout_id = self.get_hangout_id(role_name)
	if(!hangout_id){
		return false;
	}
	for(var i=0; i< self.participant_id_array.length; i++){
	  if(hangout_id == self.participant_id_array[i] ){
			return true;
	  }
	}
	return false;
}




ParticipantMgr.prototype.is_OwnGroup = function(in_role_name){

	var self = this;
	var my_role_array = self.get_own_role_array();
	var my_role = my_role_array[0];
	var my_group = self.role_group_array[my_role];

	var group_checked = self.role_group_array[in_role_name];

    if(group_checked == my_group){
    	return true;
    }
    return false;
}

ParticipantMgr.prototype.is_OwnRole = function(in_role_name){

	var self = this;
	var my_role_array = self.get_own_role_array();

	for(var i=0; i< my_role_array.length; i++){
		if(my_role_array[i] == in_role_name){
			return true;
		}
	}
    return false;
}

ParticipantMgr.prototype.is_Audience = function(in_role_name){

	var self = this;
	var group_checked = self.role_group_array[in_role_name];

    if(group_checked == "Aud"){
    	return true;
    }
    return false;

}

ParticipantMgr.prototype.getLoginStatus = function(role_name){
	var self = this;

	var parse_id = self.getParseID_fromRole(role_name);
	if(parse_id){
	  var hangout_id = self.get_hangout_id(role_name)
	  for(var i=0; i< self.participant_id_array.length; i++){
		if(hangout_id == self.participant_id_array[i] ){
			return "login";
		}
	  }
	}else{
		return "no_applicant";
	}
	return "logout";
}


ParticipantMgr.prototype.checkExistence = function(hangout_id){

	var self = this;
	for(var i=0; i<self.participant_id_array.length; i++){
		if(participant_id_array[i]==hangout_id){
			return true
		}
	}
	return false;
}

 // Init時に加え だれかが、Join ボタンやCancelボタンを押したときに、サーバデータをアップデート
ParticipantMgr.prototype.updateServerData = function(){
	
}


ParticipantMgr.prototype.getGameType = function(){

}



