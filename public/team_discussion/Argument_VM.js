
function Argument_VM(){

	var self = this;
	self.argument_title = null;
	self.argument_context = null;
	self.link_list = new Array();
	self.extension_list = new Array();
	self.refute_list = new Array();
	self.comment_list = new Array();


  	self.title_content_visible = ko.observable(false);
  	self.title_content = ko.observable(false); 
  	self.title_input_visible = ko.observable(false);
  	self.title_input = ko.observable();
  	self.isTitleTextboxFocused = ko.observable(false); 

  	self.main_content_visible = ko.observable(false); 
  	self.main_content = ko.observable(); 
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

	self.show_title();
	self.show_main_content();
	self.show_main_content_link();
	self.show_all_comment();
	self.show_comment_input();


}

Argument_VM.prototype.update_All = function(){

	var self = this;
	self.argument_obj.fetch({
	  success: function(obj) {
	  	self.argument_obj =obj;
		self.show_All();
	  },
	  error: function(obj, error) {
	  	console.log("error");
	  }
	});
}


Argument_VM.prototype.update_data_from_server = function(){

	var self = this;
	self.argument_obj.fetch({
	  success: function(obj) {
	  	self.argument_obj =obj;
		self.show_All();
	  },
	  error: function(obj, error) {
	  	console.log("error");
	  }
	});
}

	//mainly when user loged in, all data is retrieved and counter is saved on the 


Argument_VM.prototype.show_Title = function(){
	var self = this;
	title = self.argument_obj.get("title");
	if(title){
		self.title_content_visible(true);
		self.title_input_visible(false);
		self.title_content(title);
	}else{
		self.title_content_visible(false);
		self.title_input_visible(true);
	}
}

Argument_VM.prototype.click_title_edit = function(){

	var self = this;
	title = self.argument_obj.get("title");
	self.title_input(title);
	self.isTitleTextboxFocused(true);
	
}

Argument_VM.prototype.click_title_save = function(){

}
Argument_VM.prototype.click_title_cancel = function(){

}




Argument_VM.prototype.show_main_content = function(){
	var self = this;
	content = self.argument_obj.get("main_content");
	self.main_content(content)
}

Argument_VM.prototype.show_main_content_link = function(){
	var self = this;

	var link_list_array = self.argument_obj.get("link_url");
	console.log(link_list_array);
	self.main_link_array.removeAll();
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
			self.main_link_array.push(obj);
		}
	}
}

Argument_VM.prototype.show_all_comment = function(){

	var self = this;

	var additional_info_array = self.argument_obj.get("additional_comment");
	if(additional_info_array){
		for(var i=0; i<additional_info_array.length; i++ ){
			if(additional_info_array.writer_type = "team"){
				self.show_one_comment(additional_info_array.parse_id);
			}
		}
	}
}


Argument_VM.prototype.show_one_comment = function(comment_parse_id){

	var self = this;

	var Comment = Parse.Object.extend("Comment");
	var comment_query = new Parse.Query(Comment);
	comment_query.get(comment_parse_id,{
		success: function(obj){
			var comment_context = obj.get("context");
			var counter = obj.get("counter");
			var author_parse_id = obj.get("author");

		},
		error: function(){
			console.log("error to get data");
		}
	});

}

Argument_VM.prototype.show_comment_input = function(){
	var main_content = self.main_content();
	var title = self.title_content();

	if(main_content.length >1 && title.length >1){
		self.comment_input_visible(true);
	}else{
		self.comment_input_visible(false);
	}

}


Argument_VM.prototype.showUpdatedPart = function(){
	//by comparing the counter, only updated part is applied

}


Argument_VM.prototype.set_template = function(){
}

Argument_VM.prototype.show_main_argument_link = function(){
}

Argument_VM.prototype.show_comment = function(){
}



Argument_VM.prototype.show_title = function(){

	self.title = self.argument_obj.get("title");

	if(self.title){
		self.title_content_visible(true);
		self.title_content(self.title);
		self.title_input_visible(false);
	}else{
		self.title_content_visible(false);
		self.title_input_visible (true);
	}
}

Argument_VM.prototype.show_main_argument = function(){

	var title = self.argument_obj.get("main");

	if(title){
		self.main_content_visible(true);
		self.main_content(title);
		self.main_input_visible (false);
	}else{
		self.main_content_visible(false);
		self.main_input_visible (true);
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














Argument_VM.prototype.click_main_save = function(){


	var self = this;

	var context = self.main_input();
	console.log(context);

	self.argument_obj.set("context", context);
	self.argument_obj.save(null, {
	  success: function(obj) {
	    console.log("saved");
	    self.update_data_from_server();
	  },
	  error: function(obj, error) {
	    alert('Failed to create new object, with error code: ' + error.message);

	  }
	});




}
Argument_VM.prototype.click_main_edit = function(){

}
Argument_VM.prototype.click_main_cancel = function(){

}
Argument_VM.prototype.click_add_main_link = function(){

}

Argument_VM.prototype.click_comment_update = function(){

}
Argument_VM.prototype.click_comment_edit_save = function(){

}

Argument_VM.prototype.click_comment_edit_cancel = function(){

}

Argument_VM.prototype.click_comment_edit = function(){

/*
	count++
	self.context = title_input
	save(obj){
		obj.get("count");
		status()

	}
*/
}


Argument_VM.prototype.click_comment_Add = function(){


}




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
	}else if(parse_id != globwl_own_id){
		//disable edit button and show writer's name
	}else{
		//show text_box to edit by the user
	}

}



Argument_VM.prototype.update = function(type, parse_id){



	switch(type){
		case "title":
		  	self.title_content(title); 
		  	self.title_content_visible = ko.observable(true);
		  	self.title_input_visible(false);
		break;
		case "main":
		break;
		case "comment":
			update_comment(parse_id);
		break;
	}
}


Argument_VM.prototype.update_comment = function( parse_id){

	var self = this;
	var is_exist = false;

	for(var i=0; i< self.comment_list; i++){
		if(self.comment_list.id == parse_id){
			is_exist = true;
		}
	}

	if(is_exist){
		var Comment = Parse.Object.extend("Comment");
		/*
		comment_query = 
		comment_query.find(parse_id){
			function(obj){
				var comment = obj.get("context");
				var  = obj.get("link");
				var count = obj.get("count");
			}
		}
		*/
	}

}

	//更新中のIDを取得し、それは変更不可にする。
	//それ以外で、自分と同じグループのものは変更可能


//this function will be removed once this is integrated in the hangout

