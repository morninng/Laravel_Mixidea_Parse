

function AfterDebateTabWrapper(){
	var self = this;
	self.summary_tab_obj = null;

}

AfterDebateTabWrapper.prototype.update_from_server = function(){

	var self = this
	if(!self.after_debate_obj){
		return;
	}
	self.after_debate_obj.show_all();
}

AfterDebateTabWrapper.prototype.create = function(root_element_name){
	var self = this;

  self.root_element = $(root_element_name);


	var dom = $("<div>");
	dom.attr("id","after_discuss_container");


  var RelatedLink_html_Template = _.template($('[data-template="after_discuss_related_link_template"]').html());
  var RelatedLink_html_text = RelatedLink_html_Template();
  dom.append(RelatedLink_html_text);


	var prop_data = { data: {
		 title:"Additional Proposition Argument",
		 content_array:"after_dis_prop_array",
		 textarea:"input_after_dis_prop",
		 button:"add_after_dis_prop",
		 visible_loading:"visible_prop_loading"
		}};

  var Prop_html_Template = _.template($('[data-template="after_discuss_arg_template"]').html());
  var Prop_html_text = Prop_html_Template(prop_data);
  dom.append(Prop_html_text);


	var opp_data = { data: {
		 title:"Additional Opposition Argument",
		 content_array:"after_dis_opp_array",
		 textarea:"input_after_dis_opp",
		 button:"add_after_dis_opp",
		 visible_loading:"visible_opp_loading"
		}};


  var Opp_html_Template = _.template($('[data-template="after_discuss_arg_template"]').html());
  var Opp_html_text = Opp_html_Template(opp_data);
  dom.append(Opp_html_text);

	var general_data = { data: {
		 title:"General comment to this round",
		 content_array:"after_dis_general_array",
		 textarea:"input_after_dis_general",
		 button:"add_after_dis_general",
		 visible_loading:"visible_general_loading"
		}};


  var General_html_Template = _.template($('[data-template="after_discuss_arg_template"]').html());
  var General_html_text = General_html_Template(general_data);
  dom.append(General_html_text);


	self.root_element.html(dom);

	self.after_debate_obj = new AfterDebateTab();
  self.after_discuss_el = document.getElementById('after_discuss_container');
  ko.applyBindings(self.after_debate_obj, self.after_discuss_el);
  self.after_debate_obj.show_all();

}

AfterDebateTabWrapper.prototype.remove = function(){
	var self = this;

	if(!self.after_debate_obj){
		return;
	}

  ko.cleanNode(self.after_discuss_el);
  self.after_discuss_el = null;
  self.root_element.html(null);
  self.root_element = null;

  self.after_debate_obj = null;
}




function AfterDebateTab(){
	var self = this;
	self.link_array = ko.observableArray();
  self.input_url = ko.observable();
  self.input_after_dis_prop = ko.observable();
  self.input_after_dis_opp = ko.observable();
  self.input_after_dis_general = ko.observable();
  self.after_dis_prop_array = ko.observableArray();
  self.after_dis_opp_array = ko.observableArray();
  self.after_dis_general_array = ko.observableArray();
  self.visible_link_loading = ko.observable(false);
  self.visible_prop_loading = ko.observable(false);
  self.visible_opp_loading = ko.observable(false);
  self.visible_general_loading = ko.observable(false);

  self.edit_content = function(data){
  	self.changeElementState(data, "edit");
  }
  self.edit_conten_cancel = function(data){
  	self.changeElementState(data, "cancel");
  }

  self.edit_conten_save = function(data){
		console.log("edit save");
		var arg_id = data.id;
		var updated_content = data["context_edit"]


		var Argument = Parse.Object.extend("Argument");
		var arg_query = new Parse.Query(Argument);
		arg_query.get(arg_id, {
			success: function(arg_obj) {
				arg_obj.set("context", updated_content);
				arg_obj.increment("count");
				arg_obj.save(null, {
					success: function(obj) {
	  				self.increment_hangout_counter();
					},
				  error: function(gameScore, error) {
						alert("fail to save");
				  }
				});
		  },
		  error: function(object, error) {
		    alert("fail to save");
		  }
		});
  }

}



AfterDebateTab.prototype.changeElementState = function(data, in_update_type){

		var self = this;

  	var type = data.arg_type;
  	var context_array = new Array();

  	var wrapper_func_array;
  	switch(type){
  		case "AfterDis_Prop":
  			wrapper_func_array = self.after_dis_prop_array;
  		break;
  		case "AfterDis_Opp":
  			wrapper_func_array = self.after_dis_opp_array;
  		break;
  		case "AfterDis_General":
  			wrapper_func_array = self.after_dis_general_array;
  		break;
  	}
  	var index= NaN;
  	for(var i=0; i<wrapper_func_array().length; i++){
  		if(wrapper_func_array()[i]["id"] == data["id"]){
  			index=i;
  		}
  	}
  	if(!isNaN(index)){
  		var context_obj = new Object();
  		context_obj["id"] = data["id"];
  		context_obj["user_img_src"] = data["user_img_src"];
  		context_obj["user_name"] = data["user_name"];
  		context_obj["context_edit"] = data["context_edit"];
  		context_obj["context_text"] = data["context_text"];
  		context_obj["arg_type"] = data["arg_type"];

  		switch(in_update_type){
  			case "edit":
		  		context_obj["visible_edit_button"] = false;
		  		context_obj["visible_edit_context"] = true;
		  		context_obj["visible_context_text"] = false;
  			break;
  			case "cancel":
		  		context_obj["visible_edit_button"] = true;
		  		context_obj["visible_edit_context"] = false;
		  		context_obj["visible_context_text"] = true;
		  	break;
  		}

			wrapper_func_array.splice(index,1,context_obj);
  	}
}


AfterDebateTab.prototype.onEnterLinkInput = function(){

  if(event.keyCode !== 13 ){
  	return;
  }

  var self = this;

  var input_url = self.input_url();
  var valid_url = is_valid_Url(input_url)
  if(!valid_url){
  	return;
  }
  self.visible_link_loading(true);
	var url_encode_url = EncodeHTMLForm(input_url);
	var parse_obj = {url:url_encode_url};
	console.log(url_encode_url);


	Parse.Cloud.run('OgpRetrieve', parse_obj, {
		success: function(response_str) {

			response_obj = JSON.parse(response_str);
	 		if(!response_obj.url){
	 			response_obj["url"] = input_url;
	 		}
	 		if(!response_obj.title){
	 			response_obj["title"] = input_url;
	 		}
	 		if(!response_obj.description){
	 			response_obj["description"] = input_url;
	 		}
	 		if(!response_obj.site_name){
	 			response_obj["site_name"] = "";
	 		}

	 		var UrlOgp = Parse.Object.extend("UrlOgp");
			var url_ogp = new UrlOgp();
			for(key  in response_obj){
				url_ogp.set(key,response_obj[key]);
			}
			url_ogp.set("game_id",actual_game_obj.id);
			actual_game_obj.add("related_url",url_ogp);
			actual_game_obj.save(null, {
			  success: function(obj) {
			  	self.input_url(null);
	  			self.increment_hangout_counter();
			  },
			  error: function(gameScore, error) {
			  	alert("fail to save");
			  	self.visible_link_loading(false);
			  }
			});
		},
		error: function(error) {
			console.log(error);
			alert("fail to upload");
		  self.visible_link_loading(false);
		}
	});



	


}

AfterDebateTab.prototype.add_after_dis_prop = function(){

	var self = this;
	console.log("add_after_dis_prop");
	self.visible_prop_loading(true);
	var text = self.input_after_dis_prop();
	self.save_initial_content(text, "AfterDis_Prop")
}

AfterDebateTab.prototype.add_after_dis_opp = function(){

	var self = this;
	console.log("add_after_dis_opp");
	self.visible_opp_loading(true);
	var text = self.input_after_dis_opp();
	self.save_initial_content(text, "AfterDis_Opp")
}
AfterDebateTab.prototype.add_after_dis_general = function(){

	var self = this;
	console.log("add_after_dis_general");
	self.visible_general_loading(true);
	var text = self.input_after_dis_general();
	self.save_initial_content(text, "AfterDis_General")
}


AfterDebateTab.prototype.save_initial_content = function(text, content_type){

	var self = this;

	console.log(text);
	var Argument = Parse.Object.extend("Argument");
	var arg_obj = new Argument();
	arg_obj.set("context",text);
	arg_obj.set("user",global_own_parse_id);
	arg_obj.set("count",0);
	actual_game_obj.add(content_type,arg_obj);
	actual_game_obj.save(null, {
	  success: function(obj) {

	  	switch(content_type){
	  		case "AfterDis_Prop":
	  			self.input_after_dis_prop(null);
	  			break;
	  		case "AfterDis_Opp":
	  			self.input_after_dis_opp(null);
	  			break;
	  		case "AfterDis_General":
	  			self.input_after_dis_general(null);
	  			break;
	  		break;
	  	}
	  	self.increment_hangout_counter();

	  },
	  error: function(gameScore, error) {
	  	alert("fail to save");
		  self.visible_prop_loading (false);
		  self.visible_opp_loading(false);
		  self.visible_general_loading(false);
	  }
	});


}


AfterDebateTab.prototype.show_all = function(){

	var self = this;

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.include("AfterDis_Prop");
  game_query.include("AfterDis_Opp");
  game_query.include("AfterDis_General");
  game_query.include("related_url");
  game_query.get(global_debate_game_id, {
    success: function(game_obj) {

      var prop_array = game_obj.get("AfterDis_Prop");
      if(prop_array){
				self.show_after_dis_opinion(prop_array, "AfterDis_Prop");
			}
      var opp_array = game_obj.get("AfterDis_Opp");
      if(opp_array){
				self.show_after_dis_opinion(opp_array, "AfterDis_Opp");
			}
      var general_array = game_obj.get("AfterDis_General");
      if(general_array){
				self.show_after_dis_opinion(general_array, "AfterDis_General");
			}

    	var url_ogp_array = game_obj.get("related_url");
    	if(url_ogp_array){
				self.show_links(url_ogp_array);
			}

		  self.visible_link_loading(false);
		  self.visible_prop_loading (false);
		  self.visible_opp_loading(false);
		  self.visible_general_loading(false);

    },
    error: function(gameScore, error) {
    	console.log("retrieveing links failed");
		  self.visible_link_loading(false);
		  self.visible_prop_loading (false);
		  self.visible_opp_loading(false);
		  self.visible_general_loading(false);
  	}
	});
}




AfterDebateTab.prototype.show_after_dis_opinion = function(opinion_array, type){
	var self = this;

  	var wrapper_func_array;
  	switch(type){
  		case "AfterDis_Prop":
  			wrapper_func_array = self.after_dis_prop_array;
  		break;
  		case "AfterDis_Opp":
  			wrapper_func_array = self.after_dis_opp_array;
  		break;
  		case "AfterDis_General":
  			wrapper_func_array = self.after_dis_general_array;
  		break;
  	}

	for(var i=0; i<opinion_array.length; i++ ){

		if(opinion_array[i]){

			var context_obj = new Object();
			context_obj["id"] = opinion_array[i].id;
			var user_parse_id = opinion_array[i].get("user");

			context_obj["user_img_src"] = participant_mgr_obj.getPict_fromParseID(user_parse_id);
			context_obj["user_name"] = participant_mgr_obj.getFirstName_fromParseID(user_parse_id);

			var edit_content_available = false;
			if(user_parse_id == global_own_parse_id){
				edit_content_available = true;
			}
			context_obj["visible_edit_button"] = edit_content_available;
			context_obj["visible_edit_context"] = false;
			context_obj["visible_context_text"] = true;
			context_obj["context_edit"] = opinion_array[i].get("context");
			var content_text = opinion_array[i].get("context");
			var converted_text =  add_linebreak_html(content_text);
			context_obj["context_text"] = converted_text;
			context_obj["count"] = opinion_array[i].get("count");
			context_obj["arg_type"] = type;
			var exist = false;

			for(var j=0; j<wrapper_func_array().length; j++){
				if(wrapper_func_array()[j]["id"] == opinion_array[i].id){
	   			exist =true;
					if(wrapper_func_array()[j]["count"] != opinion_array[i].get("count")){
						wrapper_func_array.splice(j,1,context_obj);
					}
				}
			}
			if(!exist){
				wrapper_func_array.push(context_obj);
			}
		}
	}
}


AfterDebateTab.prototype.show_links = function(){

	var self = this;

  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.include("related_url");
  game_query.get(global_debate_game_id, {
    success: function(obj) {
    	var url_ogp_array = obj.get("related_url");
    	for(var i=0; i<url_ogp_array.length; i++ ){
    		var exist = false;
    		for(var j=0; j<self.link_array().length; j++){
    			if(self.link_array()[j]["link_url"] == url_ogp_array[i].get("url")){
    				exist = true;
    			}
    		}
    		if(exist == false){
    			var obj = new Object();
    			obj["id"] = url_ogp_array[i].id;
    			obj["title"] = url_ogp_array[i].get("title");
    			obj["img_src"] = url_ogp_array[i].get("image");
    			obj["link_url"] = url_ogp_array[i].get("url");
    			obj["description"] = url_ogp_array[i].get("description");
    			obj["site_name"] = url_ogp_array[i].get("site_name");
    			self.link_array.push(obj);
    		}
    	}
    },
    error: function(gameScore, error) {
    	console.log("retrieveing links failed");
  	}
	});
}
 

AfterDebateTab.prototype.increment_hangout_counter = function(){
	var self = this;
  var after_discuss_counter = get_hangout_after_discuss_counter();
  after_discuss_counter++;
  after_discuss_counter_str = String(after_discuss_counter);
  gapi.hangout.data.submitDelta({
      "hangout_AfterDiscuss_counter":after_discuss_counter_str,
  });
}

function is_valid_Url(s) {
    var regexp = /((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/;	
    return s.indexOf(' ') < 0 && regexp.test(s);
}






function EncodeHTMLForm(data){
    var params = [];
    for( var name in data )
    {
        var value = data[ name ];
        var param = encodeURIComponent( name ).replace( /%20/g, '+' )
            + '=' + encodeURIComponent( value ).replace( /%20/g, '+' );
        params.push( param );
    }
    return params.join('&');
}