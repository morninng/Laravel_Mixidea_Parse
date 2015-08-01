

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
	console.log(transcript_text);

	//push data on parse
}

