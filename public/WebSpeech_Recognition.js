

function WebSpeech_Recognition(){

  var self = this;

  if (!('webkitSpeechRecognition' in window)){
  	self.available=false;
  	return;
  }

  self.available=true;
  self.recognition = new webkitSpeechRecognition();
  self.recognition.continuous = true;
  self.recognition.lang = "en-US";

  self.recognition.onresult = function(e){
  	console.log("web speech api on result called");
    var results = e.results;
    for(var i = e.resultIndex; i<results.length; i++){
      if(results[i].isFinal){
        self.store_transcription_onParse(results[i][0].transcript);
      }
    }
  };
}


WebSpeech_Recognition.prototype.initialize = function(speech_transcription_id){

	var self = this;
	if(!self.available){
		return ;
	}

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
	//prepare parse to store data
}

WebSpeech_Recognition.prototype.start_recognition = function(type, role_name){

	var self = this;
	if(!self.available){
		return ;
	}
	self.type=type;
	console.log("speech recognition start");
	self.recognition.start();
}

WebSpeech_Recognition.prototype.stop_recognition = function(){

	var self = this;
	if(!self.available){
		return ;
	}
	console.log("speech recognition stop");
	self.recognition.stop();
}

WebSpeech_Recognition.prototype.store_transcription_onParse = function(transcript_text){
	var self = this;
	if(!self.available){
		return ;
	}
	console.log(transcript_text);

	var current_role = appmgr.video_view_model.get_current_speaker_role();  /*this is not poi_speaker role*/
	console.log(current_role);
	var current_speech_time = appmgr.video_view_model.get_current_time();
	var current_speech_id = get_speech_id();
	var user_parse_id = appmgr.own_parse_id;
	var transcription_obj = {id: current_speech_id, t: String(current_speech_time),
							 script: transcript_text,user_id:user_parse_id, type: self.type };
	console.log(transcription_obj);

	self.speech_transcription_obj.add(current_role, transcription_obj);
	self.speech_transcription_obj.save(null, {
	  success: function(obj) {
	  	console.log(transcript_text +  " :saved");
	  	var counter = get_transcription_counter();
	  	next_counter = counter + 1;
	  	console.log("counter is " + next_counter);
		gapi.hangout.data.submitDelta({"transcription_counter":String(next_counter),"speech_id": current_speech_id, "current_speaker_role":current_role });
	  },
	  error: function(gameScore, error) {
	  	console.log("error")
	  }
	});
}

