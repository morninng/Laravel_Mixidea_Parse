

function WebSpeech_Recognition(){

  var self = this;

  var transcription_obj = actual_game_obj.get("speech_transcription");
  self.transcription_id = transcription_obj.id;
 	self.recognition_id = "0";

  if (!('webkitSpeechRecognition' in window) || !self.transcription_id){
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

/*
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
*/

WebSpeech_Recognition.prototype.start_recognition = function(type){

	var self = this;
	if(!self.available){
		return ;
	}

	var current_role = video_view_wrapper.get_current_speaker_role();  /*this is not poi_speaker role*/
	console.log("start recognition speaker role is " + current_role);
	self.current_transcript_text_obj = null;
	self.recognition_id = get_guid();

	var Speech_Transcription = Parse.Object.extend("Speech_Transcription");
	var speech_transcription_query = new Parse.Query(Speech_Transcription);
	speech_transcription_query.get(self.transcription_id, {
	  success: function(speech_transcription_obj) {
	  	var role_trans_obj = speech_transcription_obj.get(current_role);
	  	if(!role_trans_obj){
	  			var Transcript_text = Parse.Object.extend("Transcript_text");
					var transcript_text_obj = new Transcript_text();
					speech_transcription_obj.set(current_role, transcript_text_obj);
					speech_transcription_obj.save(null, {
					  success: function(speech_transcription_obj) {
							var role_trans_obj = speech_transcription_obj.get(current_role);
							self.current_transcript_text_obj = role_trans_obj;
							console.log("speech recognition start");
							self.recognition.start();
					  },
					  error: function(obj, error) {
					  	console.log(error);
					  }
					});
			}else{
				self.current_transcript_text_obj = role_trans_obj;
				console.log("speech recognition start");
				self.recognition.start();
	  	}
	  },
	  error: function(obj, error) {
	  	console.log(error);
	  }
	});
	self.type=type;
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

	console.log("store transcription on parse is called which text is " + transcript_text);

	if(!self.available){
		return ;
	}

	var current_role = video_view_wrapper.get_current_speaker_role();  /*this is not poi_speaker role*/
	if(!current_role){
		console.log("no speaker for speech recognition");
		return;
	}
	var current_speech_time = video_view_wrapper.get_current_time();
	var current_speech_id = get_speech_id();
	var user_parse_id = global_own_parse_id;
	var transcription_obj = {id: current_speech_id,
										short_split_id: self.recognition_id,
										t: String(current_speech_time),
							 			script: transcript_text,
							 			user_id:user_parse_id, 
							 			type: self.type };

	console.log(transcription_obj);

	self.current_transcript_text_obj.add("speech_text", transcription_obj);
	self.current_transcript_text_obj.save(null, {
	  success: function(obj) {
	  	console.log(transcript_text +  " :saved");
	  	var counter = get_transcription_counter();
	  	next_counter = counter + 1;
	  	console.log("counter is " + next_counter);
			gapi.hangout.data.submitDelta({"transcription_counter":String(next_counter),"speech_id": current_speech_id,"short_split_id": self.recognition_id, "current_speaker_role":current_role });
	  },
	  error: function(gameScore, error) {
	  	console.log("error")
	  }
	});
}

