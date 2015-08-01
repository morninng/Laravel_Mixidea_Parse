

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
    var results = e.results;
    for(var i = e.resultIndex; i<results.length; i++){
      if(results[i].isFinal){
        self.store_transcription_onParse(results[i][0].transcript);
      }
    }
  };
}


WebSpeech_Recognition.prototype.initialize = function(game_id){

	var self = this;
	if(!self.available){
		return ;
	}
// this logic should be fixed later
// speech_transcription should be created when object is created.

	var Game = Parse.Object.extend("Game");
	var game_query = new Parse.Query(Game);
	game_query.get(game_id, {
	  success: function(game_obj) {
	  	var speech_transcription_obj = game_obj.get("speech_transcription");
	  	if(speech_transcription_obj){
	  		self.speech_transcription_obj = speech_transcription_obj;
	  	}else{
	  		var Speech_Transcription = Parse.Object.extend("Speech_Transcription");
	  		var new_speech_transcription_obj = new Speech_Transcription();
	  		game_obj.set("speech_transcription", new_speech_transcription_obj);
	  		game_obj.save(null, {
				success: function(obj){
				  self.speech_transcription_obj = obj.get("speech_transcription");
				},
				error: function(){
				  console.log("failed to save")
				}
			});
	  	}


	  },
	  error: function(object, error) {
	    // The object was not retrieved successfully.

	  }
	});


	//prepare parse to store data
}

WebSpeech_Recognition.prototype.start_recognition = function(){

	var self = this;
	if(!self.available){
		return ;
	}
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

	var current_role = appmgr.video_view_model.get_current_speaker_role();
	console.log(current_role);
	var current_speech_time = appmgr.video_view_model.get_current_time();
	var current_speech_id = get_speech_id();
	var transcription_obj = {id: current_speech_id, t: String(current_speech_time), script: transcript_text,};
	console.log(transcription_obj);

	self.speech_transcription_obj.add(current_role, transcription_obj);
	self.speech_transcription_obj.save(null, {
	  success: function(obj) {

	  	console.log(transcript_text +  " :saved");
	  	var counter = get_transcription_counter();
	  	next_counter = counter + 1;
	  	console.log("counter is " + next_counter);
		gapi.hangout.data.submitDelta({"transcription_counter":String(next_counter)});

	  },
	  error: function(gameScore, error) {
	  	console.log("error")
	  }
	});


}
