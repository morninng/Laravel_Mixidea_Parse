function AudioTransript(){
	var self = this;
	self.status = "not_exist";
}

AudioTransript.prototype.create = function(root_element_name){
	var self = this;
	self.status = "start_create";
	self.initialize();
	self.root_element = $(root_element_name);
	self.retrieve_data();
}

AudioTransript.prototype.initialize = function(){

	var self = this;
	var game_style = actual_game_obj.get("style");

  var transcription_obj = actual_game_obj.get("speech_transcription");
  self.transcription_id = transcription_obj.id;
  

	switch(game_style){
	  case 'NorthAmerica':
			self.role_array = ["PrimeMinister","LeaderOpposition","MemberGovernment","MemberOpposition","ReplyPM","LOReply"];
		break;
	  case 'Asian':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "GovernmentWhip","OppositionWhip","GovermentReply","OppositionReply"];
		break;
	  case 'BP':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition","MemberGovernment","MemberOpposition","GovernmentWhip","OppositionWhip"];
		break;
	}
}


AudioTransript.prototype.delete = function(){

}
AudioTransript.prototype.update = function(){
	var self = this;

	var original_status = self.status;
	self.status = "start_update";
	switch(original_status){
		case "not_exist":
		case "start_create":
		case "loading":
			return;
		break;

		case "loaded":
		case "creating_dom":
		case "dom_created":
			console.log("update the recording information");
			self.removeAll();
			self.retrieve_data();	
		break;
	}

}

AudioTransript.prototype.retrieve_data = function(){
	var self = this;

	var Speech_Transcription = Parse.Object.extend("Speech_Transcription");
	var speech_transcription_query = new Parse.Query(Speech_Transcription);
	for(var i=0; i< self.role_array.length; i++){
		speech_transcription_query.include(self.role_array[i]);
	}
	self.status = "loading";
  speech_transcription_query.get(self.transcription_id, {
	  success: function(transcript_obj) {
	  	if(self.status !="loading"){
	  		return;
	  	}
			self.status = "loaded";
	  	self.transcript_obj = transcript_obj;
	  	self.OrganizeData();
	  },
		error: function(object, error) {
		    console.log("retrieving data has been failed");
		}
	});
}


AudioTransript.prototype.OrganizeData = function(){

	var self = this;
	self.status = "creating_dom";
	for(var j=0; j< self.role_array.length; j++){

		transcription_each_role = new Array();

		var transcript_text_obj = self.transcript_obj.get(self.role_array[j]);
		var audio_src = self.transcript_obj.get(self.role_array[j] + "_Audio");
		if(transcript_text_obj){
			console.log(transcript_text_obj.id);
			console.log(self.role_array[j]);
			var transcript_text_array = transcript_text_obj.get("speech_text");
			if(transcript_text_array){
				var last_speech_id = transcript_text_array.pop().id;
				var filter_trans_array = transcript_text_array.filter(
					function (value){
						return (value.id==last_speech_id)
					}
				);
				var short_speaker_text = "";
				for(var i=0; i< filter_trans_array.length; i++){
					short_speaker_text = short_speaker_text + filter_trans_array[i]["script"] + "<br>";
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
							transcription_each_role.push(obj);
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
							transcription_each_role.push(obj);
					}
				}
			}
		}
		self.ConstructDom(self.role_array[j], audio_src, transcription_each_role );
	}
	//console.log(self.transcript_message_array);		
}


AudioTransript.prototype.ConstructDom = function(speaker_role, in_audio_src, transcription_message_array){
	
	var self = this;
	var Transcript_Template = _.template($("[data-template='AudioTranscript_Template']").html());

	var transcript_html_text = Transcript_Template({role:speaker_role, audio_src:in_audio_src,list:transcription_message_array});
	self.root_element.append(transcript_html_text);
	self.status = "dom_created";
}

AudioTransript.prototype.removeAll = function(){
	var self = this;
	self.status = null;
	self.transcript_obj = null;
	self.root_element.html(null);
}

