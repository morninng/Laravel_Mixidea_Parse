function AfterDebateTabWrapper(){
	var self = this;
	self.summary_tab_obj = null;

}


AfterDebateTabWrapper.prototype.update_from_server = function(){



}

AfterDebateTabWrapper.prototype.add = function(){
	var self = this;

	self.summary_tab_obj = new SummaryTab();

}

AfterDebateTabWrapper.prototype.remove = function(){
	var self = this;


}


function AfterDebateTab(){

}

AfterDebateTab.prototype.create = function{

}

AfterDebateTab.prototype.delete = function{

}


AfterDebateTab.prototype.show_links = function{

}
AfterDebateTab.prototype.click_add_link = function{


	var self = this;
	console.log("click add link");
	var str_link = self.link_input();
	console.log(str_link);
	var is_url = isUrl(str_link);
	console.log(is_url);
	if(is_url){
		var data_sent = EncodeHTMLForm(str_link);
		$.ajax({
		  url: "http://mixidea.org/api/get_ogp.php",
		  data: data_sent,
		  type: "POST",
		  headers: {
		    'Content-Type': 'application/x-www-form-urlencoded'
		  }
		 }).done(function(response_obj){
		 	console.log(response_obj);

	 		if(!response_obj.url){
	 			url_exist=true;
	 			response_obj["url"] = str_link;
	 		}
		 	
		 	actual_game_obj.addUnique("link_url", response_obj);
			self.general_concept_obj.save().then(function(obj) {
			  self.general_concept_obj = obj;
	    	  self.update_data_from_server();
			}, function(error) {
	    		alert('Failed to create new object, with error code: ' + error.message);
			});
		 });
	}
}


function isUrl(s) {
    var regexp = /((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/;	
    return s.indexOf(' ') < 0 && regexp.test(s);
}

AfterDebateTab.prototype.show_prop_argument = function{

}

AfterDebateTab.prototype.add_prop_argument = function{

}

AfterDebateTab.prototype.edit_prop_argument = function{

}

AfterDebateTab.prototype.show_opp_argument = function{
	// show it as a knockout array with counter
	// value is updated only when the counter is not the same

	// the logic is mostly the same as argument comment

}
AfterDebateTab.prototype.add_opp_argument = function{
	// counter is 0
}

AfterDebateTab.prototype.edit_opp_argument = function{
		//retrieve counter value and increase the counter and update
}

AfterDebateTab.prototype.show_evaluation_comment = function{

}

AfterDebateTab.prototype.add_evaluation_comment = function{

}

AfterDebateTab.prototype.edit_evaluation_comment = function{

}



