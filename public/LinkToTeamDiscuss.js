function LinkToTeamDiscussWrapper(){
	var self = this;
	self.link_team_obj = null;
}


LinkToTeamDiscussWrapper.prototype.update_from_server = function(){
	var self = this;
	if(!self.link_team_obj){
		return;
	}
	self.link_team_obj.update();
}


LinkToTeamDiscussWrapper.prototype.show_Link = function(el_name){

	var self = this;
	self.link_team_obj = new LinkToTeamDiscuss();
	self.link_team_obj.create();

  var Link_Team_html_Template = _.template($('[data-template="LinkToTeamDiscuss_template"]').html());
  self.link_team_element = $(el_name);
  var link_team_html_text = Link_Team_html_Template();
  self.link_team_element.html(link_team_html_text);
  self.link_team_el = document.getElementById('link_team_room');
  ko.applyBindings(self.link_team_obj , self.link_team_el);

}

LinkToTeamDiscussWrapper.prototype.remove_Link = function(el_name){

	var self = this;
	if(!self.link_team_obj){
		return;
	}
  ko.cleanNode(self.link_team_el);
	self.link_team_element.html(null)
	self.link_team_obj.delete();
	self.link_team_obj = null;
}


function LinkToTeamDiscuss(){
	var self = this;
	self.link_team_list = ko.observableArray();

}

LinkToTeamDiscuss.prototype.create = function(el_name){
	
	var self = this;
	self.update();
}

LinkToTeamDiscuss.prototype.delete = function(){

	var self = this;
	self.link_team_list.removeAll();

}

LinkToTeamDiscuss.prototype.update = function(){

	var self = this;
	var link_name_list = new Array();
	var is_audience = participant_mgr_obj.isAudience_yourself();
	if(is_audience){
		link_name_list = participant_mgr_obj.get_all_debater_group_name_array();
	}else{
		link_name_list[0] = participant_mgr_obj.get_own_group_name();
	}
	self.link_team_list.removeAll();
	for(var i=0; i<link_name_list.length; i++){
		link_href_list = actual_game_obj.get("hangout_id");
		var link_href = link_href_list[link_name_list[i]];
		if(link_href){
			var obj = {team_name:link_name_list[i], team_discussion_link_url: link_href};
			self.link_team_list.push(obj);
		}
	}

}