
function Argument_VM(){

	var self = this;

	self.user_editable = ko.observable(false);
	self.argument_title = null;
	self.argument_context = null;

	self.title_editor = null;
	self.title_count = -1;
  self.title_content = ko.observable(""); 
  self.title_input = ko.observable();
  self.isTitleFocused = ko.observable(false); 

  self.visible_title_textbox_written = ko.observable();
  self.visible_title_textbox_edit = ko.observable();

	self.main_editor = null;
	self.main_count = -1;
  self.main_content = ko.observable(""); 
  self.main_input = ko.observable();
  self.isMainTextboxFocused = ko.observable(false);


	self.hidden_html = ko.observable();

  self.visible_MainArg_textbox_written = ko.observable();
  self.visible_MainArg_textbox_edit = ko.observable();
  self.editor_MainArg_pict_src = ko.observable();
  self.editor_MainArg_name = ko.observable();
  self.visible_button_MainArg_save = ko.observable();
  self.visible_button_MainArg_edit = ko.observable();
  self.visible_MainArg_editing_icon = ko.observable(false);
	self.visible_save_indicate = ko.observable(false);

	self.arg_content_wrapper_css = ko.observable("textarea_wrapper_default");

  self.comment_array = ko.observableArray(false); 
  self.comment_input = ko.observable(); 
  self.comment_input_visible = ko.observable(false);
  self.arg_id = null;

/*
  self.is_default_TitleTextboxFocused.subscribe( function(focused) {
	   if (focused) {
	   		console.log("default title textbox focused");
			  global_own_edit_status = "editing";
			  global_own_edit_element = self.arg_id + "_" + "title";
				util_add_edit_status(self.arg_id, "title");
			}
	});

	self.is_default_MainTextboxFocused.subscribe( function(focused) {
	   if (focused) {
	   		console.log("main textbox focused");
			  global_own_edit_status = "editing";
			  global_own_edit_element = self.arg_id + "_" + "main";
				util_add_edit_status(self.arg_id, "main");
		}
	});
*/
	self.click_comment_edit_cancel = function(data){

		console.log(data);
		var index = NaN;
		for(var i=0; i< self.comment_array().length; i++){
			if(self.comment_array()[i].comment_id == data.comment_id ){
				index = i;
			}
		}
		if(!isNaN(index)){

			obj = {
				 comment_id:data.comment_id,
				 comment_content: data.comment_content,
				 comment_edit: data.comment_edit,

				 comment_content_visible: true,
				 comment_edit_visible: false,
				 comment_edit_button_visible:true,
				 comment_save_button_visible:false,
				 comment_cancel_button_visible: false,
				 author_pict_src:data.author_pict_src,
				 author_name:data.author_name,

				 isCommentEditTextboxFocused: false,
				 count:data.count
				};
			self.comment_array.splice(index,1,obj);
		}
	}

	self.click_comment_edit_save = function(data){
		var editid_comment = data.comment_edit;
		console.log(editid_comment);
		var parse_id = data.comment_id;
		console.log(parse_id);

		var Comment = Parse.Object.extend("Comment");
		var comment_query = new Parse.Query(Comment);;

		comment_query.get(parse_id, {
		  success: function(obj) {
		  	obj.set("context",editid_comment);
		  	obj.increment("comment_count");
		  	obj.save(null, {
			  success: function(comment_o) {
////////counter managemrent////
			util_send_argument_counter(comment_o,"comment",self.team_name, self.arg_id, self.team_name);
////////counter managemrent////
			  },
			  error: function(obj, error) {
			    console.log("error to save comment")
			  }
			});
		    // The object was retrieved successfully.
		  },
		  error: function(object, error) {
		    // The object was not retrieved successfully.
		    // error is a Parse.Error with an error code and message.
		  }
		});
	}

	self.click_comment_edit = function(data){
		console.log(data);
		var index = NaN;
		for(var i=0; i< self.comment_array().length; i++){
			if(self.comment_array()[i].comment_id == data.comment_id ){
				index = i;
			}
		}
		if(!isNaN(index)){
			obj = {
				 comment_id:data.comment_id,
				 comment_content: data.comment_content,
				 comment_edit: data.comment_edit,

				 comment_content_visible: false,
				 comment_edit_visible: true,
				 comment_edit_button_visible:false,
				 comment_save_button_visible:true,
				 comment_cancel_button_visible: true,
				 author_pict_src:data.author_pict_src,
				 author_name:data.author_name,

				 isCommentEditTextboxFocused: true,
				 count:data.count
				};

			self.comment_array.splice(index,1,obj);
		}
	}

}



Argument_VM.prototype.initialize = function(argument_obj, setting){

	var self = this;
	self.team_name = setting.team_name;
	self.element = setting.element;
	self.comment_query_team_array = setting.comment_query_array;
	self.user_editable(setting.user_editable);
	self.argument_obj = argument_obj;
	self.arg_id = argument_obj.id;
	self.root_element_id = "#Arg_" + self.arg_id;

  self.isMainTextboxFocused.subscribe( function(focused) {
	   		console.log(" text focus called id is" + self.arg_id);
	   if (focused) {
	   		this.become_editing_status()
			}
	   if (!focused) {
	   		this.save_input_context();
			}
	}, self);

  self.isTitleFocused.subscribe( function(focused) {
	   console.log(" title focus called id is" + self.arg_id);
	   if (focused) {
	   		this.become_editing_status()
			}
	   if (!focused) {
	   		this.save_input_context();
			}
	}, self);

	self.show_All();
}

Argument_VM.prototype.become_editing_status = function(){
	var self = this;

	this.arg_content_wrapper_css("textarea_wrapper_focused");
	self.visible_button_MainArg_edit(false);
	self.visible_button_MainArg_save(true);
	self.visible_MainArg_textbox_written(false);
	self.visible_MainArg_textbox_edit(true);
	self.visible_title_textbox_written(false);
	self.visible_title_textbox_edit(true);
	self.visible_MainArg_editing_icon(true);

  global_own_edit_element = self.arg_id;
	util_add_edit_status(self.arg_id);
}



Argument_VM.prototype.update_edit_status = function(){
	var self = this;

	var is_api_ready = gapi.hangout.isApiReady();
	if( !is_api_ready ){
		self.main_editor = null;
		return;
	}_

	var edit_status_str = gapi.hangout.data.getValue("edit_status");
	if(!edit_status_str){
		return;
	}
	var edit_status_obj = JSON.parse(edit_status_str);

	self.main_editor = null;
	self.title_editor = null;

	for (var key in edit_status_obj){
		if(edit_status_obj[key].id == self.arg_id && is_hangout_exist(edit_status_obj[key].hangout_id)){
			self.main_editor = key;
			console.log("main editor has set with " + key);
		}
	}
}

Argument_VM.prototype.apply_comment_data_from_server = function(){

	var self = this;
	self.show_all_comment();
}

Argument_VM.prototype.apply_argument_data_from_server = function(updated_argument_obj){

	var self = this;

	self.argument_obj =updated_argument_obj;
	self.update_edit_status();
	self.show_context();
	self.show_comment_input();
}

Argument_VM.prototype.show_All = function(){

	var self = this;
	self.update_edit_status();
	self.show_context();
	self.show_all_comment();
	self.show_comment_input();
}

	//mainly when user loged in, all data is retrieved and counter is saved on the 



Argument_VM.prototype.show_context = function(){
	var self = this;

	var title = self.argument_obj.get("title");
	var title_set = self.argument_obj.get("title_set");
	var content = self.argument_obj.get("main_content");
	converted_context = add_linebreak_html(content);
	var main_content_set = self.argument_obj.get("main_content_set");

	var MainCounter = self.argument_obj.get("main_count");

	var others_under_editing = false;
	if(self.main_editor && self.main_editor!=global_own_parse_id ){
		others_under_editing = true;
	}

	var under_editing_this_element = false;
	if( global_own_edit_element == self.arg_id){
		under_editing_this_element = true;
	}

/***** main content box *****/	
	if(under_editing_this_element){
		//do not change anything
	}else if (others_under_editing){

			self.visible_MainArg_textbox_written(true);
			self.visible_MainArg_textbox_edit(false);
			self.main_content(converted_context);
			self.main_input(content);

			self.visible_title_textbox_written(true);
			self.visible_title_textbox_edit(false);
			self.title_content(title);
			self.title_input(title);
	}else{

		if(main_content_set){
			self.visible_MainArg_textbox_written(true);
			self.visible_MainArg_textbox_edit(false);
			self.main_content(converted_context);
			self.main_input(content);
		}else{
			self.visible_MainArg_textbox_written(false);
			self.visible_MainArg_textbox_edit(true);
			self.main_content(null);
			self.main_input(null);
		}
		if(title_set){
			self.visible_title_textbox_written(true);
			self.visible_title_textbox_edit(false);
			self.title_content(title);
			self.title_input(title);
		}else{
			self.visible_title_textbox_written(false);
			self.visible_title_textbox_edit(true);
			self.title_content(null);
			self.title_input(null);
		}
	}


/***** editor picture  *****/

	if(self.main_editor){
		var editor_profile = participant_mgr_obj.get_user_profile(self.main_editor);
		if(editor_profile){
			self.editor_MainArg_pict_src(editor_profile.pict_src); 
			self.editor_MainArg_name(editor_profile.first_name);
		}
		self.visible_MainArg_editing_icon(true)
	}else{
		self.editor_MainArg_pict_src(null);
		self.editor_MainArg_name(null);
		self.visible_MainArg_editing_icon(false)
	}

/***** save or edit butto *****/	

	if(under_editing_this_element){
		//do not change anything
	}else if (others_under_editing){
			self.visible_button_MainArg_edit(false);
			self.visible_button_MainArg_save(false);
	}else{
		if(title_set || main_content_set){
			self.visible_button_MainArg_edit(true);
			self.visible_button_MainArg_save(false);
		}else{
			self.visible_button_MainArg_edit(false);
			self.visible_button_MainArg_save(false);
		}
	}

////////////counter managmenet////
	if(self.main_count != MainCounter){
	    var parse_id =  self.argument_obj.id;
	    var obj_type = "main";
	    var counter_obj = {type:obj_type, count:MainCounter};
			global_element_counter[parse_id + "_main"] = counter_obj;
			self.main_count = MainCounter;
	}
////////////counter managmenet////

}

Argument_VM.prototype.save_input_context = function(){

	var self = this;
	self.count = 0

	var context = self.main_input();
	if(context){
		if(context.length>0){
			self.argument_obj.set("main_content_set", true);
		}
		self.argument_obj.set("main_content", context);
	}else{
		self.argument_obj.set("main_content_set", false);
		self.argument_obj.set("main_content", null);
	}
	var title_context = self.title_input();
	if(title_context){
		if(title_context.length>0){
			self.argument_obj.set("title_set", true);
		}
		self.argument_obj.set("title", title_context);
	}else{
		self.argument_obj.set("title_set", false);
		self.argument_obj.set("title", null);
	}

	self.argument_obj.increment("main_count");
	self.argument_obj.save(null, {
	  success: function(obj) {
	    console.log("saved");
////////////counter managmenet////
	 		self.argument_obj = obj
			util_send_argument_counter(self.argument_obj,"main",self.team_name, null);
////////////counter managmenet////

			self.arg_content_wrapper_css("textarea_wrapper_saved");
			self.show_save_message();
			self.check_edit_status();
	  },
	  error: function(obj, error) {
	    alert('Failed to create new object, with error code: ' + error.message);

	  }
	});
}

Argument_VM.prototype.check_edit_status = function(){
	var self = this;
	var content_focusd = self.isMainTextboxFocused();
	var title_focused = self.isTitleFocused();

	if(!content_focusd && !title_focused){
		self.arg_content_wrapper_css("textarea_wrapper_default");
	  self.visible_MainArg_editing_icon(false);
		self.visible_button_MainArg_save(false);
		self.show_context();
		if(global_own_edit_element == self.arg_id){
			util_remove_edit_status();
			global_own_edit_element = null;
			self.main_editor = null;
		}
	}
}

Argument_VM.prototype.show_save_message = function(){
	var self = this;
	self.visible_save_indicate(true);
	$(".save_message", self.root_element_id ).css('opacity','1');
	$(".save_message", self.root_element_id ).animate({opacity:0},1500);
}


Argument_VM.prototype.click_comment_Add = function(){

	var self = this;
	var own_team_side = participant_mgr_obj.get_own_group_name();

	var comment_context = self.comment_input();
	var Comment = Parse.Object.extend("Comment");
	var comment_obj = new Comment();
	comment_obj.set("context", comment_context);
	comment_obj.set("argument", self.argument_obj);
	comment_obj.set("type", "extension");
	comment_obj.set("comment_count", 0);
	comment_obj.set("team", own_team_side);
	comment_obj.set("author", global_own_parse_id);
	comment_obj.save(null, {
	  success: function(comment_o) {
	  	self.comment_input("");
	  //  team_discussion_appmgr.argument_mgr.update_comment_data_from_server(self.arg_id);

///////////counter management////////////
	    util_send_argument_counter(comment_o,"comment",self.team_name, self.arg_id, self.team_name);
///////////counter management////////////

	  },
	  error: function(obj, error) {
	    // Execute any logic that should take place if the save fails.
	    // error is a Parse.Error with an error code and message.
	    alert('Failed to create new object, with error code: ' + error.message);
	  }
	});
}


Argument_VM.prototype.show_all_comment = function(){

	var self = this;

	var Comment = Parse.Object.extend("Comment");
	var comment_query = new Parse.Query(Comment);
	comment_query.equalTo("argument", self.argument_obj);
//	comment_query.equalTo("team", global_team_side);
	comment_query.containedIn("team",self.comment_query_team_array);

	comment_query.find({
	  success: function(array) {

	    for (var i = 0; i < array.length; i++) {
	      var retrieved_comment = array[i];
	      var retrieved_comment_context = retrieved_comment.get("context");
				var converted_comment_context = null;
				if(retrieved_comment_context){
					converted_comment_context = add_linebreak_html(retrieved_comment_context);
				}

	      var retrieved_count = retrieved_comment.get("comment_count");
	      var is_author_yourself = false;


	      var retrieved_team = retrieved_comment.get("team");
	      var team_style = "Aud_style";
	      if(retrieved_team == "Gov" || retrieved_team == "Prop" || retrieved_team == "OG" || retrieved_team == "CG"){
	      	team_style = "Prop_style"
	      }else if(retrieved_team == "Opp" || retrieved_team == "OO" ||retrieved_team == "CO" ){
	      	team_style = "Opp_style"
	      }

	      var comment_author = retrieved_comment.get("author");
				var comment_author_profile = participant_mgr_obj.get_user_profile(comment_author);
				var comment_author_pict_src = comment_author_profile.pict_src;
				var comment_author_name = comment_author_profile.first_name;
				if(comment_author == global_own_parse_id){
					is_author_yourself = true;
				}
	      var obj = {
					comment_id:retrieved_comment.id,
					comment_content: converted_comment_context,
					comment_edit: retrieved_comment_context,

					comment_content_visible: true,
					comment_edit_visible: false,
					comment_edit_button_visible: is_author_yourself,
					comment_save_button_visible: false,
					comment_cancel_button_visible: false,

					author_pict_src: comment_author_pict_src,
					author_name:comment_author_name,

					isCommentEditTextboxFocused: false,
					count: retrieved_count,

					team_side_style: team_style 
	      };
	      var comment_existed = false;
	      for(var j=0; j<self.comment_array().length; j++){
	      	if(self.comment_array()[j].comment_id == retrieved_comment.id){
						comment_existed = true;
						if(self.comment_array()[j].count != retrieved_count){
							self.comment_array.splice(j,1,obj);
						}
	      	}
	      }
	      if(!comment_existed){
	      	self.comment_array.push(obj);
	      }
////////////counter management ///////
		    var parse_id = retrieved_comment.id;
		    var CommentCounter = retrieved_count;
		    var obj_type = "comment";
		    var counter_obj = {type:obj_type,parent:self.arg_id, count:CommentCounter};
				global_element_counter[parse_id + "_comment"] = counter_obj;

////////////counter management ///////
	    }
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}



Argument_VM.prototype.show_comment_input = function(){
	var self = this;
	var main_content = self.main_content();
	var title = self.title_content();

	if(main_content && title && main_content.length >1 && title.length >1){
		self.comment_input_visible(true);
	}else{
		self.comment_input_visible(false);
	}
}




 /*
	the additional data should be stored like this
	array[
	 {type:"comment",writer_type:"audience",user_id:"xxxx", parse_id:"AAA",like:1},
	 {type:"extension",writer_type:"team",user_id:"xxxx", parse_id:"AAA",like:2},
	 {type:"extension",writer_type:"team",user_id:"xxxx", parse_id:"AAA",like:3},
	 {type:"refute",writer_type:"opponent",user_id:"xxxx", parse_id:"AAA",like:1},
	 {type:"refute",writer_type:"opponent",user_id:"xxxx", parse_id:"AAA",like:1}
	]
	By using these pattern, the info to be displayed can be controlled.
	CASE: team discussion: role is always team
	CASE: user_id = current: show_remove or edit button
	case: under_debate: only refute is shown to the opponent team discussion

	these field will be managed in this class, but parse field is separated.
 */




/*
This structure is handset status to be shared 

hangout_obj
[
 general:[
	 {
	  id:XXX,
	  team:gov,
	  count:222
	  updating:false
	},
	{
	  id:XXX,
	  team:opp,
	  count:222,
	  updating:parse_id_A
	}
 ]
 def:{
  team:gov
  id:YYY
  updating:false
 },
 arg:[
 {id:XXX,
  team:gov
  title_count:11,
  main_count:222,
  updating:parse_id_C
  comment:[
    {id:YYY, count:333},
    {id:aaa, count:444},
    {id:bbb, count:555},
  ]
 }
*/



// edit status is applied only to main_content and title
// comment update is always possible by the writer.


	//更新中のIDを取得し、それは変更不可にする。
	//それ以外で、自分と同じグループのものは変更可能


Argument_VM.prototype.onEnterTitle = function(data, event){
	var self = this;
	self.input_data_manage(data, event,"title");
}

Argument_VM.prototype.onEnterContext = function(data, event){
	var self = this;
	self.input_data_manage(data, event,"main");
}

Argument_VM.prototype.input_data_manage = function(data, event, type){

	var self = this;
	console.log(event.keyCode);
	self.visible_button_MainArg_save(true);

	self.arg_content_wrapper_css("textarea_wrapper_updating");
	if(event.keyCode === 32 && self.prev_keycode != 32){ /*space*/
		self.count++;
		console.log("space count up");
	}

  if((event.keyCode === 13 && self.prev_keycode != 13) /*Enter*/
  	 || (event.keyCode === 190 && self.prev_keycode != 190) /*period*/
  	 || (event.keyCode === 188 && self.prev_keycode != 188) /*comma*/
  	 || (self.count > 2)
  	 ){
  	
  	switch(type){
  		case "main":
  			var inputed_value = self.main_input();
  			var number_row = self.update_height( inputed_value);
  		break;
  		case "title":
  		break;
  	}
  	self.save_input_context();
  	self.count = 0;
  }
  self.prev_keycode = event.keyCode;

}

Argument_VM.prototype.update_height = function(text){

	var self = this;	

	converted_text = add_linebreak_html(text);
	self.hidden_html(converted_text);
	var hidden_height = $(".hidden_text", self.root_element_id).height();
	var current_height = $(".MainArg_input_edit", self.root_element_id).height();
	if(current_height< (hidden_height+ 20)){
		$(".MainArg_input_edit", self.root_element_id).height(hidden_height + 20);	
	}
}

Argument_VM.prototype.click_content_save = function(){
  var self = this;
}

Argument_VM.prototype.click_content_edit = function(){

	console.log("edit button clicked");
  var self = this;
  self.become_editing_status();
  self.isTitleFocused(true);

}