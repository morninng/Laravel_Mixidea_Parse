
function TeamDiscussion_ParticipantMgr(){

	var self = this;
	self.participants_obj = new Object();

	console.log("team discussion participant new");

}

TeamDiscussion_ParticipantMgr.prototype.update = function(){

	var self = this;
	console.log("participant manager update");

	self.own_parse_id = global_own_parse_id;
	self.own_hangout_id = global_own_hangout_id;
	var participants_array = team_discussion_appmgr.actual_game_obj.get("participants");
		
	console.log( participants_array);

	if(!participants_array){
		return;
	}
	
	var participants_obj = new Object();

	for(var i=0; i< participants_array.length; i++){
		var parse_id = participants_array[i].id;
		var FirstName = participants_array[i].get("FirstName");
		var LastName = participants_array[i].get("LastName");
		var src = participants_array[i].get("Profile_picture");
		var obj = {first_name:FirstName, last_name:LastName, pict_src:src };
		participants_obj[parse_id] = obj
	}

	self.participants_obj = participants_obj;

}

TeamDiscussion_ParticipantMgr.prototype.get_user_profile = function(in_parse_id){
	var self = this;

	var profile = self.participants_obj[in_parse_id];
	if(profile){
		return profile;
	}

	var obj = {first_name:"unrecognized user", last_name:"", pict_src:"" };
	return obj;
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



