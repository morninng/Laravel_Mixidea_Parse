
function GeneralConcept_VM(){

	var self = this;
	self.argument_context = null;
//	self.link_array = ko.observableArray();
//  	self.content_visible = ko.observable(false); 
//  	self.input_visible = ko.observable(false); 
  	self.content_text = ko.observable(); 
  	self.content_text_input = ko.observable();
  	self.isTextboxFocused = ko.observable(false);
  	self.is_default_TextboxFocused = ko.observable(false);
  	self.visible_Concept_textbox_default = ko.observable(false);
  	self.visible_Concept_textbox_written = ko.observable(false);
  	self.visible_Concept_textbox_edit = ko.observable(false);

  	self.visible_button_Concept_edit = ko.observable(false);
  	self.visible_button_Concept_cancel = ko.observable(false);
  	self.visible_button_Concept_save = ko.observable(false);

  	self.visible_Concept_editing_icon = ko.observable(false);

  	self.editor_Concept_name = ko.observable();
  	self.editor_Concept_pict_src = ko.observable();
  	self.visible_editor_Concept_profile = ko.observable();

//  	self.link_input = ko.observable("http://");
  	self.concept_count = -1;
  	self.concept_id = null;
  	self.concept_editor = null;

  	self.is_default_TextboxFocused.subscribe( function(focused) {
   		if (focused) {
	   		console.log("concept textbox focused");
			team_discussion_appmgr.add_edit_status(self.concept_id, "concept");
		}
	});

}

GeneralConcept_VM.prototype.initialize = function(general_concept_obj){

	var self = this;
	self.concept_id = general_concept_obj.id;
	self.update(general_concept_obj);
}

GeneralConcept_VM.prototype.update = function(general_concept_obj){
	var self = this;
	self.general_concept_obj = general_concept_obj;
	self.show_concept();
}

GeneralConcept_VM.prototype.update_edit_status = function(){
	var self = this;

	self.concept_editor = null;
	var is_api_ready = gapi.hangout.isApiReady();
	if( !is_api_ready ){
		return;
	}

	var edit_status_str = gapi.hangout.data.getValue("edit_status");
	if(!edit_status_str){
		return;
	}

	var edit_status_obj = JSON.parse(edit_status_str);
	var concept_id = self.concept_id + "_concept";
	for (var key in edit_status_obj){
		if(edit_status_obj[key].id == concept_id && is_hangout_exist(edit_status_obj[key].hangout_id)){
			self.concept_editor = key;
			console.log("concept editor has set with " + key);
		}
	}
}



GeneralConcept_VM.prototype.show_concept = function(){

	var self = this;
	var context = self.general_concept_obj.get("context");
	var convert_context = null;
	if(context){
  		convert_context = add_linebreak_html(context);
  	}
	var ConceptCount = self.general_concept_obj.get("count");
	var count = self.general_concept_obj.get("count");
	var others_under_editing = false;

	if(self.concept_editor && self.concept_editor!=global_own_parse_id ){
		others_under_editing = true;
	}

	var own_edit_status =  team_discussion_appmgr.own_edit_status;
	var own_edit_element =  team_discussion_appmgr.own_edit_element;
	var under_editing_this_element = false;
	var element_edit_param =  self.concept_id + "_concept";;

	if(element_edit_param == own_edit_element){
		under_editing_this_element = true;
	}

/***** concept content box *****/	
	if(under_editing_this_element){
		//do not change anything
	}else{
		if(own_edit_status == "default" && !context && !others_under_editing){
			console.log("show default text box for arg context");
			self.visible_Concept_textbox_default(true);
			self.visible_Concept_textbox_written(false);
			self.visible_Concept_textbox_edit(false);
			self.content_text(convert_context);
			self.content_text_input(convert_context);
		}else{
			self.visible_Concept_textbox_default(false);
			self.visible_Concept_textbox_written(true);
			self.visible_Concept_textbox_edit(false);
			self.content_text(convert_context);
			self.content_text_input(convert_context);
		}
	}

/***** editor picture  *****/

	if(self.concept_editor){
		console.log("main editor exist");
		var editor_profile = team_discussion_appmgr.participant_mgr_obj.get_user_profile(self.concept_editor);
		if(editor_profile){
			console.log("show profile");
			self.editor_Concept_pict_src(editor_profile.pict_src); 
			self.editor_Concept_name(editor_profile.first_name);
			self.visible_editor_Concept_profile(true);
		}
		self.visible_Concept_editing_icon(true)
	}else{
		self.editor_Concept_pict_src(null);
		self.editor_Concept_name(null);
		self.visible_editor_Concept_profile(false);
		self.visible_Concept_editing_icon(false)
	}


/***** concept content button *****/	
	if(under_editing_this_element){
		//do not change anything
	}else{
		if( others_under_editing){
			self.visible_button_Concept_save(false);
			self.visible_button_Concept_cancel(false);
			self.visible_button_Concept_edit(false);
		}else{
			switch(own_edit_status){
			case "default":
				if(context){
					self.visible_button_Concept_save(false);
					self.visible_button_Concept_cancel(false);
					self.visible_button_Concept_edit(true);
				}else{
					self.visible_button_Concept_save(true);
					self.visible_button_Concept_cancel(false);
					self.visible_button_Concept_edit(false);
				}
			break;
			case "editing":
				self.visible_button_Concept_save(false);
				self.visible_button_Concept_cancel(false);
				self.visible_button_Concept_edit(false);
			break;
			case "pending":
				self.visible_button_Concept_save(false);
				self.visible_button_Concept_cancel(false);
				self.visible_button_Concept_edit(true);
			break;
			}
		}
	}

////////////counter managmenet///////
	if(self.concept_count != count){
	    var parse_id = self.general_concept_obj.id;
	    var ConceptCounter = count;
	    var obj_type = "concept";
	    var counter_obj = {type:obj_type, count:ConceptCounter};
		team_discussion_appmgr.element_counter[parse_id + "_concept"] = counter_obj;
		self.concept_count = ConceptCounter;
	}

////////////counter managmenet///////




/*
	var link_list_array = self.general_concept_obj.get("link_url");
	console.log(link_list_array);
	self.link_array.removeAll();
	if(link_list_array){
		for(var i=0; i<link_list_array.length; i++ ){

			var url_str = link_list_array[i].url;
			var img_src = link_list_array[i].image;
			var title = link_list_array[i].title;
			var description = link_list_array[i].description;

			var obj = {link_url: url_str,
						link_title: title,
						link_image_url: img_src,
						link_desription: description
						}
			self.link_array.push(obj);
		}
	}
*/
}

GeneralConcept_VM.prototype.update_data_from_server = function(general_concept_obj){

	var self = this;
	self.general_concept_obj.fetch({
	  success: function(obj) {
	  	self.general_concept_obj =obj;
		self.show_concept();
	  },
	  error: function(obj, error) {
	  	console.log("error");
	  }
	});
}

GeneralConcept_VM.prototype.click_edit_concept = function(){

	var self = this;

	var context = self.general_concept_obj.get("context");
	self.content_text_input(context);
	self.visible_Concept_textbox_default(false);
	self.visible_Concept_textbox_written(false);
	self.visible_Concept_textbox_edit(true);
	self.isTextboxFocused(true);

  	self.visible_button_Concept_save(true);
  	self.visible_button_Concept_cancel(true);
  	self.visible_button_Concept_edit(false);

	team_discussion_appmgr.add_edit_status(self.concept_id, "concept");

}

/*
GeneralConcept_VM.prototype.click_add_link = function(){

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
		 	
		 	self.general_concept_obj.addUnique("link_url", response_obj);
			self.general_concept_obj.save().then(function(obj) {
			  self.general_concept_obj = obj;
	    	  self.update_data_from_server();
			}, function(error) {
	    		alert('Failed to create new object, with error code: ' + error.message);
			});
		 });
	}

}
*/

GeneralConcept_VM.prototype.click_cancel_concept = function(){
	var self = this;

	team_discussion_appmgr.own_edit_status = "pending";
	team_discussion_appmgr.own_edit_element = null;
	self.show_concept();

	var new_edit_status_obj = new Object();
	var current_edit_status_obj = gapi.hangout.data.getValue("edit_status");
    if(current_edit_status_obj){
    	new_edit_status_obj = JSON.parse(current_edit_status_obj);
    }
    delete new_edit_status_obj[global_own_parse_id];
	var new_edit_status_obj_str = JSON.stringify(new_edit_status_obj);
    var edit_status_counter = get_hangout_edit_status_counter();
    edit_status_counter++;
    edit_status_counter_str = String(edit_status_counter);

	gapi.hangout.data.submitDelta({
		"edit_status":new_edit_status_obj_str,
		"edit_status_counter":edit_status_counter_str
	});

}

GeneralConcept_VM.prototype.click_save_concept = function(){
	var self = this;
	console.log("click save");
	self.save_concept();

}



GeneralConcept_VM.prototype.save_concept = function(){

	var self = this;
	var context = self.content_text_input();

	counter = self.general_concept_obj.get("count");

	if(typeof counter === "undefined"){
		self.general_concept_obj.set("count", 0);
	}else{
		self.general_concept_obj.increment("count");
	}
	self.general_concept_obj.set("context", context);
	self.general_concept_obj.save(null, {
	  success: function(obj) {

////////counter managemrent////

    	var parse_id = obj.id;
	    var ConceptCounter = obj.get("count"); 	
	    var obj_type = "concept";
	    var new_counter_obj = new Object();
	    var counter_obj = {type:obj_type, count:ConceptCounter, parent:self.concept_id};
	    var element_counter_key =  "element_counter" + global_team_side;
	    var original_counter_obj = gapi.hangout.data.getValue(element_counter_key);

	    if(original_counter_obj){
	    	new_counter_obj = JSON.parse(original_counter_obj);
	    }else{
	    	new_counter_obj = new Object();
	    }
	    new_counter_obj[parse_id + "_concept"] = counter_obj;
	    var new_counter_obj_str = JSON.stringify(new_counter_obj);


	    var new_counter_object = new Object();
	    new_counter_object[element_counter_key] = new_counter_obj_str;

//	    gapi.hangout.data.submitDelta(new_counter_object);

////////counter managemrent////

		team_discussion_appmgr.own_edit_status = "pending";
		team_discussion_appmgr.own_edit_element = null;
		self.concept_editor = null;
		var new_edit_status_obj = new Object();
		var current_edit_status_obj = gapi.hangout.data.getValue("edit_status");
	    if(current_edit_status_obj){
	    	new_edit_status_obj = JSON.parse(current_edit_status_obj);
	    }
	    delete new_edit_status_obj[global_own_parse_id];
		var new_edit_status_obj_str = JSON.stringify(new_edit_status_obj);
	    var edit_status_counter = get_hangout_edit_status_counter();
	    edit_status_counter++;
	    edit_status_counter_str = String(edit_status_counter);
	    var hangout_status_obj_Concept = new_counter_object;
	    hangout_status_obj_Concept["edit_status"] = new_edit_status_obj_str;
	    hangout_status_obj_Concept["edit_status_counter"] = edit_status_counter_str;
		gapi.hangout.data.submitDelta( hangout_status_obj_Concept);

	  },
	  error: function(obj, error) {
	    alert('Failed to create new object, with error code: ' + error.message);

	  }
	});

}
/*

function isUrl(s) {
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
*/