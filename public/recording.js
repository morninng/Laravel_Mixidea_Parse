function RecordingWrapper(){
	var self = this;
	self.under_recording = false;
	self.store_speech_id = null;
	self.speaker_role_name = null;
}

RecordingWrapper.prototype.open = function(){
	var self = this;
	self.record_obj = self.record_obj ||  new Recording();
	var transcription_obj = actual_game_obj.get("speech_transcription");
  self.speech_transcription_id = transcription_obj.id;
}

RecordingWrapper.prototype.close = function(){
	var self = this;
	self.record_ob.finish_audio_polling();
	self.record_obj = null;
}

RecordingWrapper.prototype.Speech_Start = function(type, speaker_role_name){
	var self = this;

	if(!self.record_obj){
		return;
	}
	if(self.record_obj.get_availability()){
		var game_id = global_debate_game_id;
		var speech_id = get_speech_id();
		self.speaker_role_name = speaker_role_name;
		self.file_name = game_id + speaker_role_name + speech_id;
		switch(type){
			case "speaker":
				self.current_speech_type = "speaker";
				self.under_recording = true;
				if(self.store_speech_id == speech_id){
					self.record_obj.resume_record(self.file_name);
				}else{
					self.record_obj.start_record(self.file_name);
				}
			break;
			case "poi":
				self.record_obj.resume_record(self.file_name);
				self.current_speech_type = "poi";
				self.under_recording = true;
			break;
		}
		self.store_speech_id = speech_id;
	}

}

RecordingWrapper.prototype.Speech_Finish = function(type, speaker_role_name ){
	var self = this;
	if(!self.record_obj){
		return;
	}
	if(!self.under_recording){
		return;
	}
	switch(type){
		case "discussion":
			self.record_obj.stop_record_save(self.file_name, speaker_role_name , self.speech_transcription_id);
		break;
		case "other":
			self.record_obj.suspend_record(self.file_name);
		break;
	}

}


function Recording(){
	var self = this;
	self.audio_available = false
	self.recording = false;
	self.socket_available = false;
	self.initialize();
	self.socket_communication_start();
}


Recording.prototype.get_availability = function(){
	var self = this;

	if(self.audio_available && self.socket_available){
		return true;
	}
	return false;
}


Recording.prototype.socket_communication_start = function(){
	var self = this;

//	self.socket_io = io.connect('https://127.0.0.1:3000/');
	self.socket_io = io.connect('https://recording.mixidea.org:3000/');

	self.socket_io.on('connect', function(){
		console.log("socket connected");
		self.socket_available = true;

		self.socket_io.on('record_complete', function(data){
			console.log('record complete' + data.filename);
		});

		self.socket_io.on('disconnect', function(){
			console.log('disconnected');
			self.socket_available = false;
			if(self.stream){
				console.log("disconnected");
				self.recording = false;
				self.stream.end();
				self.stream = null;
			}
		});
	});
}

Recording.prototype.initialize = function(){

	var self = this;

	if (!navigator.getUserMedia){
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia;
	}

	if (navigator.getUserMedia) {
		console.log("get user media");
		navigator.getUserMedia(
			{audio:true},
			function(stream){
				self.audio_available = true;
			 	self.start_audio_polling(stream);
			},
			function(e) {console.log('Error'); } );
	} else{
		console.log('getUserMedia not supported');
	}
}


Recording.prototype.start_record = function(in_file_name){

	var self = this;

	if(!self.socket_available || !self.audio_available){
		return;
	}

	if(!self.stream){
		console.log("start recording");
		self.recording = true;
		self.stream = ss.createStream();
		console.log("audio polling stream id " + self.stream.id)
		ss(self.socket_io).emit('audio_record_start', self.stream, {filename:in_file_name,sample_rate:self.sample_rate} );
	}else{
		console.log("recording is already on going");
	}
}

Recording.prototype.resume_record = function(in_file_name){

	var self = this;

	if(!self.socket_available || !self.audio_available){
		return;
	}


	if(!self.stream){
		console.log("resume recording");
		self.recording = true;
		self.stream = ss.createStream();
		console.log("audio polling stream id " + self.stream.id)
		ss(self.socket_io).emit('audio_record_resume', self.stream, {filename:in_file_name,sample_rate:self.sample_rate} );
	}else{
		console.log("recording is already on going");
	}
}

Recording.prototype.suspend_record = function(in_file_name){
	var self = this;
	if(!self.socket_available || !self.audio_available){
		return;
	}
	console.log("suspend recording");
	if(self.stream){
		self.recording = false;
		self.stream.end();
		self.stream = null;
		self.socket_io.emit('audio_record_suspend', {filename:in_file_name});
	}
}

Recording.prototype.stop_record_save = function(in_file_name, in_role_name, in_speech_transcript_id){

	var self = this;
	if(!self.socket_available || !self.audio_available){
		return;
	}
	console.log("stop recording");
	if(self.stream){
		self.recording = false;
		self.stream.end();
		self.stream = null;
		self.socket_io.emit('audio_record_end', {filename:in_file_name, role_name: in_role_name, speech_transcript_id: in_speech_transcript_id });
	}
}




Recording.prototype.start_audio_polling = function(stream){

	var self = this;
	console.log("start polling")

	audioContext = window.AudioContext || window.webkitAudioContext;
	self.context = new audioContext();
	self.sample_rate = self.context.sampleRate;
	self.audioInput = self.context.createMediaStreamSource(stream);
	var bufferSize = 4096;
	
	self.scriptNode = self.context.createScriptProcessor(bufferSize, 1, 1);
	self.audioInput.connect(self.scriptNode)
	self.scriptNode.connect(self.context.destination); 

	self.scriptNode.onaudioprocess = function(audioProcessingEvent){
	  if(!self.recording || !self.socket_io ){
	   return;
	  }
	  var left = audioProcessingEvent.inputBuffer.getChannelData(0);
	  var audio_array_buffer = convertoFloat32ToInt16(left);
		var stream_buffer = new ss.Buffer(audio_array_buffer);
		self.stream.write(stream_buffer, 'buffer');
	}
}


Recording.prototype.finish_audio_polling = function(){
	var self = this;
	//source.disconnect(self.scriptNode);
  self.scriptNode.disconnect(self.context.destination);
  self.context.close();
  self.context = null;
}


function convertoFloat32ToInt16(buffer) {
  var len = buffer.length;

  var double_len = len*2;
  var unit8_buf = new Uint8Array(double_len);
  var int16_variable = new Int16Array(1);
  for (var i=0; i< len; i++) {
    int16_variable[0] = buffer[i]*0x7FFF;    //convert to 16 bit PCM
    unit8_buf[2*i] = int16_variable[0] & 0x00FF; //convert to uint8 for stream buffer
    unit8_buf[2*i+1] = (int16_variable[0] & 0xFF00) >> 8;
  }
  return unit8_buf.buffer
}
