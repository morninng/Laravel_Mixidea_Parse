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

  var team_disucussion_hangout_appid = "918649959098";
  var game_id = appmgr.game_id;
  var hangout_query_key = "&gd=";
  var hangout_query_value = "?gid=";
  var hangout_gid = "?gid=";
  var hangout_query_split = "_";
  var first_query_value = global_own_parse_id;
  var second_query_value = global_debate_game_id;
  var third_query_value = global_original_hangout_appid;
  var fifth_query_value = participant_mgr_obj.get_own_group_name();

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
		var hangout_domain = link_href_list[link_name_list[i]];
		if(hangout_domain){
	  var fourth_query_value = link_name_list[i];
	  var hangout_link_str= hangout_domain + hangout_gid + team_disucussion_hangout_appid
               + hangout_query_key + first_query_value + hangout_query_split
                + second_query_value + hangout_query_split + third_query_value
                + hangout_query_split + fourth_query_value
                + hangout_query_split + fifth_query_value;

			var obj = {team_name:link_name_list[i], team_discussion_link_url: hangout_link_str};
			self.link_team_list.push(obj);
		}
	}

}