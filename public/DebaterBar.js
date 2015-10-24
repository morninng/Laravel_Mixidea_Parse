

function DebaterBar(){
	var self = this;
}

DebaterBar.prototype.Delete = function(){
	var self = this;
	if(!self.debater_bar_element){
		return;
	}
	self.debater_bar_element.html(null);
	self.debater_bar_element = null;
}

DebaterBar.prototype.CreateBar = function(el_name){

	var self = this;
	var game_style = actual_game_obj.get("style");

	switch(game_style){
	  case 'NorthAmerica':
			role_array = ["PrimeMinister","LeaderOpposition","MemberGovernment","MemberOpposition","ReplyPM","LOReply"];
			role_name_display = ["PM","LO","MG","MO","RPM","LOR"];
		break;
	  case 'Asian':
	  	role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "GovernmentWhip","OppositionWhip","GovermentReply","OppositionReply"];
	  	role_name_display = ["PM","LO","DPM","DLO","GW","OW","PMR","LOR"];
		break;
	  case 'BP':
	  	role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition","MemberGovernment","MemberOpposition","GovernmentWhip","OppositionWhip"];
	  	role_name_display = ["PM","LO","DPM","DLO","MG","MO","GW","OW"];
		break;
	}
	var debater_bar_array = new Array();
	for(var i=0; i<role_name_display.length; i++ ){
		var debater_bar_obj = new Object();
		var debater_name = participant_mgr_obj.getUserFirstName(role_array[i]);
		debater_bar_obj["role_name_display"] = role_name_display[i];
		debater_bar_obj["role_name_id"] = role_array[i];
		debater_bar_obj["debater_name"] = debater_name;
		debater_bar_array.push(debater_bar_obj);
	}

  var DebaterBar_Template = _.template($("[data-template='debater_bar_template']").html());
  self.debater_bar_element = $(el_name);
  var debater_bar_html_text = DebaterBar_Template({list:debater_bar_array});
  self.debater_bar_element.html(debater_bar_html_text);
}


DebaterBar.prototype.update_speaker = function(){

	var self = this;
	if(!self.debater_bar_element){
		return;
	}

	$('.side_role_box' ).css('background-color', '#F0FFF0');
	var role_name =	video_view_wrapper.get_current_speaker_role();
	if(role_name){
		$('#side_' + role_name).css('background-color', '#1E90FF');
	}

	return;
}
