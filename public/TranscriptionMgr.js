
function TranscriptionMgr(){

  var self = this;
  self.transcription_array = ko.observableArray();
  self.current_speech_id = null;
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
	var speech_array = self.speech_transcription_obj.get(role_name);
	var current_speech_id = get_speech_id();
	console.log(speech_array);
	console.log(current_speech_id);

	speech_array = speech_array.filter(function(v){ return (v.id == current_speech_id)});
	console.log(speech_array);

}
