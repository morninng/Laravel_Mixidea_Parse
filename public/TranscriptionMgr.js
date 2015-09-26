
function TranscriptionMgr(){

  var self = this;
  self.transcription_array = ko.observableArray();
  self.transcription_title = ko.observable();
  self.current_speech_id = null;
  self.speech_array_length = 0;
  self.current_user_id = null;
}

TranscriptionMgr.prototype.initialize = function(speech_transcription_id){

//load data

	var self = this;
	
	var Speech_Transcription = Parse.Object.extend("Speech_Transcription");
	var speech_transcription_query = new Parse.Query(Speech_Transcription);
	speech_transcription_query.get(speech_transcription_id, {
	  success: function(transcription_obj) {
	  	self.speech_transcription_obj = transcription_obj;
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
