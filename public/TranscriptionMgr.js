

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

			/*size adjustment*/
			var transcription_default_size = 900;
			var transcription_left_position = $('#transcript_box').position().left;
			var transcription_width = $('#transcript_box').width();
			var transcription_right_position = transcription_left_position + transcription_width;
			var expected_left_position = transcription_right_position - transcription_default_size
			var video_transcript_margin = 20;

			var video_width = $('#video_area_container').width();
			var left_limit = video_width + video_transcript_margin;

			if(left_limit>expected_left_position){
					var next_transcription_width = transcription_default_size - (left_limit - expected_left_position);
					$('#transcript_box').width(next_transcription_width);
			}else{
					$('#transcript_box').width(transcription_default_size);
			}

			/*scroll up*/

			self.visible_transctiption_box(true);
			 $('.transcript_body').scrollTop($('.transcript_body')[0].scrollHeight);

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



