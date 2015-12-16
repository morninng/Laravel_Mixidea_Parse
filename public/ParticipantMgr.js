
function ParticipantMgr(){

	var self = this;
	self.debater_obj = new Object();
	self.audience_obj_array = new Array();
	self.participants_obj = new Object();
	self.game_style = null;
	self.parse_hangout_idmapping_array = new Array();
	self.role_array = new Array();
}

ParticipantMgr.prototype.initialize = function(){

	var self = this;

	var participants_array = actual_game_obj.get("participants");
	if(participants_array){
		for(var i=0; i< participants_array.length; i++){
			var parse_id = participants_array[i].id;
			var FirstName = participants_array[i].get("FirstName");
			var LastName = participants_array[i].get("LastName");
			var src = participants_array[i].get("Profile_picture");
			var obj = {first_name:FirstName, last_name:LastName, pict_src:src };
			self.participants_obj[parse_id] = obj
		}
	}
	self.debater_obj = actual_game_obj.get("participant_role");
	audience_parseid_array = actual_game_obj.get("audience_participants");

	if(audience_parseid_array){
		for(var i=0; i< audience_parseid_array.length; i++){
			var num =i+1;
	    eval("var role_name = 'audience" + num + "'");
	    var user_parse_id = audience_parseid_array[i];
	    self.audience_obj_array.push({ role:role_name, parse_id:user_parse_id });
		}
	}
	self.game_style = actual_game_obj.get("style");

	self.update_hangout_participants();
	self.setGameData();

}

ParticipantMgr.prototype.is_your_own_hangoutid = function(in_hangout_id){
	var self = this;
	if(!in_hangout_id){
		return false;
	}
	if(in_hangout_id == get_own_hangout_id()){
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

	var own_role_array = new Array();
	own_role_array = self.get_role_array_fromParseID(global_own_parse_id);
	own_group = self.getRoleGroup(own_role_array[0]);

	return own_group;
}

ParticipantMgr.prototype.update_parse_data = function( ){

	var self = this;

	var participants_array = actual_game_obj.get("participants");
	if(participants_array){
		for(var i=0; i< participants_array.length; i++){
			var parse_id = participants_array[i].id;
			var FirstName = participants_array[i].get("FirstName");
			var LastName = participants_array[i].get("LastName");
			var src = participants_array[i].get("Profile_picture");
			var obj = {first_name:FirstName, last_name:LastName, pict_src:src };
			self.participants_obj[parse_id] = obj
		}
	}
	self.debater_obj = actual_game_obj.get("participant_role");

	audience_parseid_array = actual_game_obj.get("audience_participants");
	self.audience_obj_array.length=0;
	if(audience_parseid_array){
		for(var i=0; i<audience_parseid_array.length; i++){
			var num =i+1;
		  eval("var role_name = 'audience" + num + "'");
		  var user_parse_id = audience_parseid_array[i];
		  self.audience_obj_array.push({ role:role_name, parse_id:user_parse_id });
		}
	}
	self.game_style = actual_game_obj.get("style");
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

	var mapping_key = new Array();
	self.parse_hangout_idmapping_array.length = 0;
	var participants_array = actual_game_obj.get("participants");
	if(participants_array){
		for(var i=0; i< participants_array.length; i++){
			mapping_key[i] = "mapping_" + participants_array[i].id;
			var mapping_data_str = gapi.hangout.data.getValue(mapping_key[i]);
			if(mapping_data_str){
				var mapping_data = JSON.parse(mapping_data_str);
				self.parse_hangout_idmapping_array.push(mapping_data);
			}
		}
	}
}



ParticipantMgr.prototype.setGameData = function(){

	var self = this;
	var game_style = self.game_style;
	
	switch(game_style){
	  case 'NorthAmerica':
		self.role_array = ["PrimeMinister","LeaderOpposition","MemberGovernment","MemberOpposition","ReplyPM","LOReply","Audince1","Audince2","Audince3","Audince4"];
		self.role_group_array = {PrimeMinister:"Gov",LeaderOpposition:"Opp",MemberGovernment:"Gov",MemberOpposition:"Opp",ReplyPM:"Gov",LOReply:"Opp",audience1:"Aud",audience2:"Aud",audience3:"Aud",audience4:"Aud",audience5:"Aud",audience6:"Aud",audience7:"Aud",audience8:"Aud",audience9:"Aud",audience10:"Aud"};
		self.group_name_array = ["Gov","Opp"];
		break;
	  case 'Asian':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "GovernmentWhip","OppositionWhip","GovermentReply","OppositionReply","Audince1","Audince2"];
		self.role_group_array = {PrimeMinister:"Gov",LeaderOpposition:"Opp",DeptyPrimeMinister:"Gov",DeptyLeaderOpposition:"Opp",GovernmentWhip:"Gov",OppositionWhip:"Opp",GovermentReply:"Gov",OppositionReply:"Opp",audience1:"Aud",audience2:"Aud",audience3:"Aud",audience4:"Aud",audience5:"Aud",audience6:"Aud",audience7:"Aud",audience8:"Aud",audience9:"Aud",audience10:"Aud"};
		self.group_name_array = ["Gov","Opp"];
		break;
	  case 'BP':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "MemberGovernment","MemberOpposition","GovermentWhip","OppositionWhip","Audince1","Audince2"];
		self.role_group_array = {PrimeMinister:"OG",LeaderOpposition:"OO",DeptyPrimeMinister:"OG",DeptyLeaderOpposition:"OO",MemberGovernment:"CG",MemberOpposition:"CO",GovernmentWhip:"CG",OppositionWhip:"CO",audience1:"Aud",audience2:"Aud",audience3:"Aud",audience4:"Aud",audience5:"Aud",audience6:"Aud",audience7:"Aud",audience8:"Aud",audience9:"Aud",audience10:"Aud"};
		self.group_name_array = ["OG","OO","CG","CO"];
		break;
	}
}

ParticipantMgr.prototype.get_all_debater_group_name_array = function(){
  var self = this;
  return self.group_name_array;
}

ParticipantMgr.prototype.get_all_rolename_array = function(){
  var self = this;
  return self.role_array;
}


ParticipantMgr.prototype.get_role_array_fromParseID = function(parse_id){

	var self = this;

	var role_array = new Array();

	for(key in self.debater_obj){
		if(self.debater_obj[key] == parse_id){
	  		role_array.push(key);
		}
	}
	for(var i=0; i< self.audience_obj_array.length; i++){
	  if(self.audience_obj_array[i].parse_id == parse_id){
	    role_array.push(self.audience_obj_array[i].role)
	  }
	}
	return role_array;
}


ParticipantMgr.prototype.get_role_array = function(hangout_id){

	var self = this;

	var parse_id = self.getParseID_fromHangoutID(hangout_id);

	return self.get_role_array_fromParseID(parse_id);

}

ParticipantMgr.prototype.get_number_of_audience = function(){

	var self = this;
	return self.audience_obj_array.length;
}


ParticipantMgr.prototype.get_own_role_array = function(){

	var self = this;
	var role_array = new Array();
	
	role_array = self.get_role_array_fromParseID(global_own_parse_id);
	return role_array;
}


ParticipantMgr.prototype.getFirstName_fromParseID = function(parse_id){

	var self = this;
	var profile =  self.participants_obj[parse_id];
	if(profile){
		return profile.first_name;
	}
	return null;
}

ParticipantMgr.prototype.get_user_profile = function(parse_id){

	var self = this;
	var profile =  self.participants_obj[parse_id];
	if(profile){
		return profile;
	}
	return null;
}


ParticipantMgr.prototype.getPict_fromParseID = function(parse_id){

	var self = this;
	var profile =  self.participants_obj[parse_id];
	if(profile){
		return profile.pict_src;
	}
	return null;
}


ParticipantMgr.prototype.getFirstName_fromHangoutID = function(hangout_id){

	var self = this;
	var parse_id = self.getParseID_fromHangoutID(hangout_id);
	var profile =  self.participants_obj[parse_id];
	if(profile){
		return profile.first_name;
	}
	return null;
}


ParticipantMgr.prototype.getName_fromHangoutID = function(hangout_id){

	var self = this;
	var parse_id = self.getParseID_fromHangoutID(hangout_id);
	var profile =  self.participants_obj[parse_id];
	if(profile){
		var full_name = profile.first_name + profile.last_name;
		return full_name;
	}
	return null;
}

ParticipantMgr.prototype.getPictSrc_fromHangoutID = function(hangout_id){

	var self = this;
	var parse_id = self.getParseID_fromHangoutID(hangout_id);
	var profile =  self.participants_obj[parse_id];
	if(profile){
		return profile.pict_src;
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
	  if(self.audience_obj_array[i].parse_id == global_own_parse_id){
	    return true;
	  }
	}
	return false;
}


ParticipantMgr.prototype.isDebater_yourself = function(){	

	var self = this;

	for(key in self.debater_obj){
		if(self.debater_obj[key] == global_own_parse_id){
	  		return true;	
		}
	}

	return false;	
}

ParticipantMgr.prototype.getUserPictureSrc = function(role_name){

	var self = this;
	var parse_id = self.getParseID_fromRole(role_name)
	var profile =  self.participants_obj[parse_id];
	if(profile){
		return profile.pict_src;
	}
	return null;
}

ParticipantMgr.prototype.getUserFirstName = function(role_name){

	var self = this;
	var parse_id = self.getParseID_fromRole(role_name)
	var profile =  self.participants_obj[parse_id];
	if(profile){
		return profile.first_name;
	}
	return null;
}



ParticipantMgr.prototype.getUserFullName = function(role_name){

	var self = this;

	var parse_id = self.getParseID_fromRole(role_name)
	var profile =  self.participants_obj[parse_id];
	if(profile){
		var full_name = profile.first_name + profile.last_name;
		return full_name;
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

	for(key in self.debater_obj){
		if(key == role_name){
	  		return self.debater_obj[key];	
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

