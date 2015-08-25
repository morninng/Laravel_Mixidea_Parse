
function Argument_VM(){

	var self = this;
	self.argument_title = null;
	self.argument_context = null;
	self.link_list = new Array();
	self.extension_list = new Array();
	self.refute_list = new Array();
	self.comment_list = new Array();


	self.title_count = -1;
  	self.title_content_visible = ko.observable(false);
  	self.title_content = ko.observable(""); 
  	self.title_input_visible = ko.observable(false);
  	self.title_input = ko.observable();
  	self.isTitleTextboxFocused = ko.observable(false); 


	self.main_count = -1;
  	self.main_content_visible = ko.observable(false); 
  	self.main_content = ko.observable(""); 
  	self.main_input_visible = ko.observable(false); 
  	self.main_input = ko.observable();

  	self.isMainTextboxFocused = ko.observable(false);
	self.main_link_array = ko.observableArray();
  	self.main_link_input = ko.observable("http://");

  	self.comment_array = ko.observableArray(false); 
  		// in the content array, content , edit field, edit button exist
  	self.comment_input = ko.observable(); 
  	self.comment_input_visible = ko.observable(false);
  	self.isCommentInputTextboxFocused = ko.observable();

  	self.arg_id = null;

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
				 comment_id:self.comment_array()[index].comment_id,
				 comment_content: self.comment_array()[index].comment_content,
				 comment_edit: self.comment_array()[index].comment_content,
				 comment_content_visible: true,
				 comment_edit_visible: false,
				 isCommentEditTextboxFocused: false
				};

			self.comment_array.splice(index,1,obj);
		}



	}

	self.click_comment_edit_save = function(data){
		var editid_comment = data.comment_edit;
		console.log(editid_comment);
		var parse_id = data.comment_id;
		console.log(parse_id);
		/*
		var comment_obj = data.comment_obj;
		console.log(comment_obj);*/

		var Comment = Parse.Object.extend("Comment");
		var comment_query = new Parse.Query(Comment);;

		comment_query.get(parse_id, {
		  success: function(obj) {
		  	obj.set("context",editid_comment);
		  	obj.increment("count");
		  	obj.save(null, {
			  success: function(obj) {
		//    	team_discussion_appmgr.argument_mgr.update_comment_data_from_server(self.arg_id);

////////counter managemrent////

    	var parse_id = obj.id;
	    var CommentCounter = obj.get("count");
	    console.log("comment count is "+ CommentCounter);
	    var obj_type = "comment";
	    var new_counter_obj = new Object();
	    var counter_obj = {type:obj_type, count:CommentCounter, parent:self.arg_id};
	    var element_counter_key =  "element_counter" + global_team_side;
	    console.log(element_counter_key);

	    var original_counter_obj = gapi.hangout.data.getValue(element_counter_key);
	    console.log("original element counter in save event");
	    console.log(original_counter_obj)
	    if(original_counter_obj){
	    	new_counter_obj = JSON.parse(original_counter_obj);
	    }else{
	    	new_counter_obj = new Object();
	    }
	    new_counter_obj[parse_id + "_comment"] = counter_obj;
	    console.log("parse id is" + parse_id);
	    console.log("new element counter after incremented");
	    console.log(new_counter_obj);
	    var new_counter_obj_str = JSON.stringify(new_counter_obj);

	    var new_counter_object = new Object();
	    new_counter_object[element_counter_key] = new_counter_obj_str;

	    gapi.hangout.data.submitDelta(new_counter_object);

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
				 isCommentEditTextboxFocused: true
				};

			self.comment_array.splice(index,1,obj);
		}
	}

}
/*
 comment object in parse
 {
	{ author_list:"xxxx",author_role:"audience",like:1, link_url}
 }
 comment object for knockout
  {comment_content_visible: false, comment_content:"aaaa", link_url:"http://",
    link_image_url:"http://", link_title, link_desription , comment_edit_visible,
     comment_edit, isCommentEditTextboxFocused,  link_input:"http://",  }

 click_comment_edit
 click_comment_edit_save
 click_comment_edit_cancel
*/



Argument_VM.prototype.initialize = function(argument_obj){

	self = this;
	self.argument_obj = argument_obj;
	self.arg_id = argument_obj.id;
	console.log(argument_obj.id);
	self.show_All();
}


Argument_VM.prototype.apply_comment_data_from_server = function(){

	var self = this;
	self.show_all_comment();
}

Argument_VM.prototype.apply_argument_data_from_server = function(updated_argument_obj){

	var self = this;

	/*
	self.argument_obj.fetch({
	  success: function(obj) {
	*/

	self.argument_obj =updated_argument_obj;
	self.show_title();
	self.show_main_content();
	self.show_comment_input();
	/*
	  },
	  error: function(obj, error) {
	  	console.log("error");
	  }
	});
*/
}

Argument_VM.prototype.show_All = function(){

	var self = this;
	self.show_title();
	self.show_main_content();
	self.show_all_comment();
	self.show_comment_input();
}

	//mainly when user loged in, all data is retrieved and counter is saved on the 

Argument_VM.prototype.show_title = function(){
	var self = this;
	var title = self.argument_obj.get("title");
	var count = self.argument_obj.get("title_count");

	if(title){

////////////counter managmenet///////
		if(self.title_count != count){

			self.title_content_visible(true);
			self.title_input_visible(false);
			self.title_content(title);

			self.title_content_visible(true);
			self.title_input_visible(false);

		    var parse_id = self.argument_obj.id;
		    var TitleCounter = count;
		    var obj_type = "title"
		    var counter_obj = {type:obj_type, count:TitleCounter};
			team_discussion_appmgr.element_counter[parse_id + "_title"] = counter_obj;
		}
////////////counter managmenet//////"_title"


	}else{
		self.title_content_visible(false);
		self.title_input_visible(true);
	}
	self.title_count = count;
}


Argument_VM.prototype.show_main_content = function(){
	var self = this;
	var content = self.argument_obj.get("main_content");
	var MainCounter = self.argument_obj.get("main_count");

	if(content){
  		convert_context = add_linebreak_html(content);
		self.main_content(convert_context);
		if(self.main_count != MainCounter){
			self.main_content_visible(true);
			self.main_input_visible(false);


////////////counter managmenet////
		    var parse_id =  self.argument_obj.id;
		    var obj_type = "main";
		    var counter_obj = {type:obj_type, count:MainCounter};
			team_discussion_appmgr.element_counter[parse_id + "_main"] = counter_obj;
////////////counter managmenet////


		}
	}else{
		self.main_content_visible(false);
		self.main_input_visible(true);
	}
	self.main_count = MainCounter;
}



Argument_VM.prototype.click_title_edit = function(){

	var self = this;
	title = self.argument_obj.get("title");

	self.title_content_visible(false);
	self.title_input_visible(true);
	self.title_input(title);
	self.isTitleTextboxFocused(true);

}


Argument_VM.prototype.click_main_edit = function(){


	var self = this;
	content = self.argument_obj.get("main_content");

	self.main_content_visible(false);
	self.main_input_visible(true);
	self.main_input(content);
	self.isMainTextboxFocused(true);

}



Argument_VM.prototype.click_title_save = function(){

	var self = this;

	var title_content = self.title_input();
	console.log(title_content);

	self.argument_obj.set("title", title_content);
	self.argument_obj.increment("title_count");
	self.argument_obj.save(null, {
	  success: function(obj) {
	    console.log("saved");
	    self.argument_obj = obj;

////////////counter managmenet////
	    var parse_id = obj.id;
	    var TitleCounter = obj.get("title_count");
	    var obj_type = "title";
	    var new_counter_obj = new Object();
	    var counter_obj = {type:obj_type, count:TitleCounter};
	    var element_counter_key =  "element_counter" + global_team_side;
	    console.log(element_counter_key);

	    var original_counter_obj = gapi.hangout.data.getValue(element_counter_key);
	    if(original_counter_obj){
	    	new_counter_obj = JSON.parse(original_counter_obj);
	    }else{
	    	new_counter_obj = new Object();
	    }
	    new_counter_obj[parse_id + "_title"] = counter_obj;
	    var new_counter_obj_str = JSON.stringify(new_counter_obj);
	    console.log(new_counter_obj_str);

	    var new_counter_obj = new Object();
	    new_counter_obj[element_counter_key] = new_counter_obj_str;
	    gapi.hangout.data.submitDelta(new_counter_obj);

////////////counter managmenet////


	  },
	  error: function(obj, error) {
	    alert('Failed to create new object, with error code: ' + error.message);

	  }
	});
}

Argument_VM.prototype.click_main_save = function(){


	var self = this;

	var context = self.main_input();
	console.log(context);
	self.argument_obj.set("main_content", context);
	self.argument_obj.increment("main_count");
	self.argument_obj.save(null, {
	  success: function(obj) {
	    console.log("saved");
	 //   team_discussion_appmgr.update_argument_from_server();

	 	self.argument_obj = obj

////////////counter managmenet////

	    var parse_id = obj.id;
	    var MainCounter = obj.get("main_count");
	    var obj_type = "main";
	    var new_counter_obj = new Object();
	    var counter_obj = {type:obj_type, count:MainCounter};
	    var element_counter_key =  "element_counter" + global_team_side;

	    var original_counter_obj = gapi.hangout.data.getValue(element_counter_key);
	    if(original_counter_obj){
	    	new_counter_obj = JSON.parse(original_counter_obj);
	    }else{
	    	new_counter_obj = new Object();
	    }
	    new_counter_obj[parse_id + "_main"] = counter_obj;
	    var new_counter_obj_str = JSON.stringify(new_counter_obj);

	    var new_counter_obj = new Object();
	    new_counter_obj[element_counter_key] = new_counter_obj_str;
	    gapi.hangout.data.submitDelta(new_counter_obj);


////////////counter managmenet////


	  },
	  error: function(obj, error) {
	    alert('Failed to create new object, with error code: ' + error.message);

	  }
	});

}

Argument_VM.prototype.click_comment_Add = function(){

	var self = this;

	var comment_context = self.comment_input();
	var Comment = Parse.Object.extend("Comment");
	var comment_obj = new Comment();
	comment_obj.set("context", comment_context);
	comment_obj.set("argument", self.argument_obj);
	comment_obj.set("type", "extension");
	comment_obj.set("count", 0);
	comment_obj.set("team", global_team_side);
	comment_obj.addUnique("author", global_own_parse_id);
	comment_obj.save(null, {
	  success: function(obj) {
	  	self.comment_input("");
	  //  team_discussion_appmgr.argument_mgr.update_comment_data_from_server(self.arg_id);

///////////counter management////////////

	    var parse_id = obj.id;
	    var CommentCounter = obj.get("count");
	    var obj_type = "comment";
	    var new_counter_obj = new Object();
	    var counter_obj = {type:obj_type, count:CommentCounter, parent:self.arg_id};
	    var element_counter_key =  "element_counter" + global_team_side;

	    var original_counter_obj = gapi.hangout.data.getValue(element_counter_key);
	    if(original_counter_obj){
	    	new_counter_obj = JSON.parse(original_counter_obj);
	    }else{
	    	new_counter_obj = new Object();
	    }
	    new_counter_obj[parse_id + "_comment"] = counter_obj;
	    var new_counter_obj_str = JSON.stringify(new_counter_obj);

	    var new_counter_obj = new Object();
	    new_counter_obj[element_counter_key] = new_counter_obj_str;
	    gapi.hangout.data.submitDelta(new_counter_obj);



///////////counter management////////////


	  },
	  error: function(obj, error) {
	    // Execute any logic that should take place if the save fails.
	    // error is a Parse.Error with an error code and message.
	    alert('Failed to create new object, with error code: ' + error.message);
	  }
	});

}




Argument_VM.prototype.click_title_cancel = function(){
	var self = this;
	self.show_title();

}

Argument_VM.prototype.click_main_cancel = function(){
	var self = this;
	self.show_main_content();
	self.main_content_visible(true);
	self.main_input_visible(false);

}

Argument_VM.prototype.show_all_comment = function(){

	var self = this;

	var Comment = Parse.Object.extend("Comment");
	var comment_query = new Parse.Query(Comment);
	comment_query.equalTo("argument", self.argument_obj);
	comment_query.equalTo("team", global_team_side);
	comment_query.find({
	  success: function(array) {

	    for (var i = 0; i < array.length; i++) {
	      var retrieved_comment = array[i];
	      var retrieved_comment_context = retrieved_comment.get("context");
	      var retrieved_count = retrieved_comment.get("count");
	      console.log("retrieved comment count is "+ retrieved_count);
	      if(retrieved_comment_context){
		      console.log(retrieved_comment_context);
		      var comment_existed = false;

		      var obj = {
		      		/* comment_obj:comment, */
		      		 comment_id:retrieved_comment.id,
		      		 comment_content: retrieved_comment_context,
		      		 comment_edit: retrieved_comment_context,
		      		 comment_content_visible: true,
		      		 comment_edit_visible: false,
		      		 isCommentEditTextboxFocused: false,
		      		 count: retrieved_count
		      		};

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
		  }


////////////counter management ///////

		    var parse_id = retrieved_comment.id;
		    var CommentCounter = retrieved_count;
		    var obj_type = "comment";
		    var counter_obj = {type:obj_type,parent:self.arg_id, count:CommentCounter};
			team_discussion_appmgr.element_counter[parse_id + "_comment"] = counter_obj;

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

	if(main_content.length >1 && title.length >1){
		self.comment_input_visible(true);
	}else{
		self.comment_input_visible(false);
	}
}


Argument_VM.prototype.set_template = function(){
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

Argument_VM.prototype.edit_status = function(psrse_id){

	if(!parse_id){
		//show edit button
	}else if(parse_id != global_own_id){
		//disable edit button and show writer's name
	}else{
		//show text_box to edit by the user
	}
}


	//更新中のIDを取得し、それは変更不可にする。
	//それ以外で、自分と同じグループのものは変更可能

