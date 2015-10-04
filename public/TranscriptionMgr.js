

function transcript_box_wrapper(){
	var self = this;
	self.transcript_obj = null;
}

transcript_box_wrapper.prototype.update_status_from_server = function(){
	var self = this;
	if(!self.transcript_obj){
		return;
	}
	self.transcript_obj.update();

}

transcript_box_wrapper.prototype.show = function(el_name){
	var self = this;
	
	if(!self.transcript_obj){

		self.transcript_obj = new transcript_box();
	  var Transcription_html_Template = _.template($('[data-template="transcription_template"]').html());
	  self.transcription_element = $(el_name);
	  var transcription_html_text = Transcription_html_Template();
	  self.transcription_element.html(transcription_html_text);
	  self.transcription_el = document.getElementById('transcription_field');
	  ko.applyBindings(self.transcript_obj , self.transcription_el);

	}
	// ここでは表示しない。update from serverでデータがきたときに表示

}

transcript_box_wrapper.prototype.hide = function(){
	var self = this;

	if(!self.transcript_obj){
		return;
	}
  ko.cleanNode(self.transcription_el);
  self.transcription_element.html(null);
  self.transcript_obj = null;
  self.transcription_el = null;
}


function transcript_box(){

	var self = this;
  var transcription_obj = actual_game_obj.get("speech_transcription");
  self.transcription_id = transcription_obj.id;

	self.transcript_message_array = ko.observableArray();
	self.transcript_header_title = ko.observable();
	self.visible_maximize_button = ko.observable(false);
	self.visible_collapse_button = ko.observable(true);
	self.visible_transctiption_box = ko.observable(false);

}

transcript_box.prototype.update = function(){

	var self = this;

	self.transcript_header_title("transcription");

	var current_role = video_view_wrapper.get_current_speaker_role();  /*this is not poi_speaker role*/
	console.log("transcription role is " + current_role);

	var Speech_Transcription = Parse.Object.extend("Speech_Transcription");
	var speech_transcription_query = new Parse.Query(Speech_Transcription);
  speech_transcription_query.include(current_role);
  speech_transcription_query.get(self.transcription_id, {
	  success: function(transcript_obj) {
	  	var transcript_text_obj = transcript_obj.get(current_role);
	  	if(!transcript_text_obj){
	  		return;
	  	}
	  	var transcript_text_array = transcript_text_obj.get("speech_text");
	  	if(!transcript_text_array){
	  		return;
	  	}else{
	  		self.transcript_message_array.removeAll();
	  	}
	  	var current_speech_id = get_speech_id();

	  	var filter_trans_array = transcript_text_array.filter(
				function (value){
					return (value.id==current_speech_id)
				}
			);

			var short_speaker_text = "";
			for(var i=0; i< filter_trans_array.length; i++){
				short_speaker_text = short_speaker_text + filter_trans_array[i]["script"];
				if(i < filter_trans_array.length -1){
					if(filter_trans_array[i]["short_split_id"] != filter_trans_array[i+1]["short_split_id"] ){
						var obj = {};
						obj["transcription_message"] = short_speaker_text;
						obj["speaker_role"] = filter_trans_array[i]["type"];
						var speaker_user_id = filter_trans_array[i]["user_id"];
						obj["speaker_name"] = participant_mgr_obj.getFirstName_fromParseID(speaker_user_id);
						if(obj["speaker_role"] == "speaker"){
							obj["transcription_box_class"] = "transcript_speaker";
						}else{
							obj["transcription_box_class"] = "transcript_poi";
						}
						console.log(obj);
						self.transcript_message_array.push(obj);
						short_speaker_text = "";
					}
				}else{  //last
						var obj = {};
						obj["transcription_message"] = short_speaker_text;
						obj["speaker_role"] = filter_trans_array[i]["type"];
						var speaker_user_id = filter_trans_array[i]["user_id"];
						obj["speaker_name"] = participant_mgr_obj.getFirstName_fromParseID(speaker_user_id);
						if(obj["speaker_role"] == "speaker"){
							obj["transcription_box_class"] = "transcript_speaker";
						}else{
							obj["transcription_box_class"] = "transcript_poi";
						}
						console.log(obj);
						self.transcript_message_array.push(obj);
				}
			}
			self.visible_transctiption_box(true);
		},
		error: function(object, error) {
		    // The object was not retrieved successfully.
		    // error is a Parse.Error with an error code and message.
		}
	});
 }


transcript_box.prototype.click_collapse = function(){

	var self = this;
	 $('#transcription_wrap').slideUp("slow");
	self.visible_maximize_button(true);
	self.visible_collapse_button(false);
}

transcript_box.prototype.click_expand = function(){

	var self = this;
	 $('#transcription_wrap').slideDown("slow");
	self.visible_maximize_button(false);
	self.visible_collapse_button(true);
}
transcript_box.prototype.click_close = function(){

	var self = this;
	 $('#transcript_box').slideUp("slow");
	self.visible_maximize_button(false);
	self.visible_collapse_button(false);
}





function TranscriptionMgr(){

  var self = this;
  self.transcription_array = ko.observableArray();
  self.transcription_title = ko.observable();
  self.current_speech_id = null;
  self.speech_array_length = 0;
  self.current_user_id = null;
}

TranscriptionMgr.prototype.initialize = function(){

//load data

	var self = this;

	var speech_transcription_id = actual_game_obj.get("speech_transcription").id;
	var Speech_Transcription = Parse.Object.extend("Speech_Transcription");
	var speech_transcription_query = new Parse.Query(Speech_Transcription);
	speech_transcription_query.get(speech_transcription_id, {
	  success: function(transcription_obj) {
	  	self.speech_transcription_obj = transcription_obj;
	  	var short_split_id



	  },
	  error: function(object, error) {
	    // The object was not retrieved successfully.
	  }
	});


}

TranscriptionMgr.prototype.update = function(){

	var self = this;
	var next_speech_id = get_speech_id();
	if(next_speech_id != self.current_speech_id){
		self.transcription_array.destroyAll();
		self.current_speech_id = next_speech_id;
		self.speech_array_length = 0;
  	self.current_user_id = null;
	}
	if(!self.speech_transcription_obj){
		return;
	}


	self.speech_transcription_obj.fetch({
	  success: function(obj) {
	  	self.speech_transcription_obj = obj;
	  	self.display_transcription()
	    // The object was refreshed successfully.
	  },
	  error: function(obj, error) {
	    // The object was not refreshed successfully.
	    // error is a Parse.Error with an error code and message.
	  }
	});
	//fetch and apply to user


//self.transcription_array.push({img_url:pict_src, name:name,PoiTake_button_visible:poi_take_visible, cancel_button_visible:poi_cancel_visible, hangout_id: in_hangout_id});
}


TranscriptionMgr.prototype.display_transcription = function(){

	var self = this;
	var role_name = get_current_speaker_role();
	var speech_obj_array = self.speech_transcription_obj.get(role_name);
	var current_speech_id = get_speech_id();
	if(!role_name || !speech_obj_array || !current_speech_id){
		return;
	}
	console.log(speech_obj_array);
	console.log(current_speech_id);

	speech_obj_array = speech_obj_array.filter(function(v){ return (v.id == current_speech_id)});
	self.transcription_title(  role_name + "'s transcription");

	if(self.speech_array_length < speech_obj_array.length){
		for(var i = self.speech_array_length; i< speech_obj_array.length; i++){
			var speech_obj = speech_obj_array[i];
			var transcription_text = speech_obj.script;
			var speaker_parse_id = speech_obj.user_id;
			var speaker_type_str = speech_obj.type;

			if(speaker_parse_id == self.current_user_id){
				var transcription_obj ={transcription_message: transcription_text,
										role_split_visible: false,
										role_type: null,
										speaker_name: null
									}
				self.transcription_array.push(transcription_obj);
			}else{
				var speaker_name_str = appmgr.participant_manager_object.getFirstName_fromParseID(speaker_parse_id);
				var transcription_obj ={transcription_message: transcription_text,
										role_split_visible: true,
										speaker_type: speaker_type_str,
										speaker_name: speaker_name_str
									}
				self.transcription_array.push(transcription_obj);
			}

			self.current_user_id = speaker_parse_id;
		}
		self.speech_array_length = speech_obj_array.length
	}

	console.log(speech_obj_array);

}
