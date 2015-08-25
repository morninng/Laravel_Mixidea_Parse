
function GeneralConcept_VM(){

	var self = this;
	self.argument_context = null;
	self.link_array = ko.observableArray();
  	self.content_visible = ko.observable(false); 
  	self.input_visible = ko.observable(false); 
  	self.content_text = ko.observable(); 
  	self.content_text_input = ko.observable();
  	self.isTextboxFocused = ko.observable(false);
  	self.link_input = ko.observable("http://");
  	self.concept_count = -1;

  	self.isTextboxFocused.subscribe( function(focused) {
	   if (!focused) {
	   		console.log("un-focused");
			self.save_concept();
		}
	});

}

GeneralConcept_VM.prototype.initialize = function(general_concept_obj){

	var self = this;
	self.update(general_concept_obj);

}

GeneralConcept_VM.prototype.update = function(general_concept_obj){
	var self = this;
	self.general_concept_obj = general_concept_obj;
	self.show_retrieved_data();
}



GeneralConcept_VM.prototype.show_retrieved_data = function(general_concept_obj){

	var self = this;
	var context = self.general_concept_obj.get("context");
	var count = self.general_concept_obj.get("count");

  	if(context){
////////////counter managmenet///////
		if(self.concept_count != count){

	  		self.content_text_input(context);
	  		convert_context = add_linebreak_html(context);
	  		self.content_text(convert_context);
	  		self.content_visible(true);
	  		self.input_visible(false);

		    var parse_id = self.general_concept_obj.id;
		    var ConceptCounter = count;
		    var obj_type = "concept"
		    var counter_obj = {type:obj_type, count:ConceptCounter};
			team_discussion_appmgr.element_counter[parse_id + "_concept"] = counter_obj;
		}

////////////counter managmenet///////


	}else{
  		self.content_visible(false);
  		self.input_visible(true);
	}



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
		self.show_retrieved_data();
	  },
	  error: function(obj, error) {
	  	console.log("error");
	  }
	});


}


GeneralConcept_VM.prototype.click_edit_concept = function(){

	var self = this;

	console.log("click edit");
  	self.content_visible(false);
  	self.input_visible(true);
  	self.isTextboxFocused(true);



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

	console.log("click edit");

}

GeneralConcept_VM.prototype.click_save_concept = function(){

	var self = this;
	console.log("click save");
	self.save_concept();

}



GeneralConcept_VM.prototype.save_concept = function(){

	var self = this;

	var context = self.content_text_input();
	console.log(context);

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
	    var counter_obj = {type:obj_type, count:ConceptCounter, parent:self.arg_id};
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

	    gapi.hangout.data.submitDelta(new_counter_object);

////////counter managemrent////

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