
function TeamDiscussion_ParticipantMgr(){

	var self = this;
	self.participants_obj_array = new Array();
}

TeamDiscussion_ParticipantMgr.prototype.update = function(){

	var self = this;

	self.participants_obj_array = team_discussion_appmgr.actual_game_obj.get("participants");
	self.own_parse_id = global_own_parse_id;
	self.own_hangout_id = global_own_hangout_id;

	var participant_obj = new Object();

	for(var i=0; i< self.participants_obj_array.length; i++){
		var parse_id = self.participants_obj_array[i].id;
		var FirstName = self.participants_obj_array[i].get("FirstName");
		var LastName = self.participants_obj_array[i].get("LastName");
		var src = self.participants_obj_array[i].get("Profile_picture");
		var obj = {first_name:FirstName, last_name:LastName, pict_src:src };
		participant_obj[parse_id] = obj
	}

	self.participant_obj = participant_obj;

}

TeamDiscussion_ParticipantMgr.get_user_profile = function(in_parse_id){

	var profile = self.participant_obj_array[in_parse_id];
	return profile;
}


TeamDiscussion_ParticipantMgr.prototype.is_your_own_parseid = function(in_parse_id){
	var self = this;
	if(!in_parse_id){
		return false;
	}
	if(in_parse_id == global_own_parse_id){
		return true;
	}
	return false;
}



