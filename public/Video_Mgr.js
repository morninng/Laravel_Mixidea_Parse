function VideoViewWrapper(){
  var self = this;
  self.video_default_vm = null;
  self.video_speaker_vm = null;
}


VideoViewWrapper.prototype.update_from_server = function(){
  var self = this;
  if(!self.video_speaker_vm ){
    return;
  }
  self.video_speaker_vm.update();
}


VideoViewWrapper.prototype.hide_video = function(){

  var canvas = gapi.hangout.layout.getVideoCanvas();
  canvas.setVisible(false);

}


VideoViewWrapper.prototype.show_defaultView = function(el_name){

  var self = this;
  if(self.video_default_vm){return;  }


  self.video_default_vm = new DefultVideoView();
  self.video_default_vm.create(el_name);
}
VideoViewWrapper.prototype.remove_defaultView = function(){

  var self = this;
  if(!self.video_default_vm){return;  }
  self.video_default_vm.remove();
  self.video_default_vm = null;

}

VideoViewWrapper.prototype.show_SpeakerView = function(el_name){
  var self = this;
  if(self.video_speaker_vm){
    return;
  }

  self.video_speaker_vm = new VideoViewModel();

  var Video_html_Template = _.template($('[data-template="video_area_template"]').html());
  self.video_element = $(el_name);
  var Video_html_text = Video_html_Template();
  self.video_element.html(Video_html_text);
  self.video_speaker_vm.initialize();
  self.video_el = document.getElementById('video_area_container');
  ko.applyBindings(self.video_speaker_vm, self.video_el);
  self.video_speaker_vm.update();
}


VideoViewWrapper.prototype.remove_SpeakerView = function(){

  var self = this;
  if(!self.video_speaker_vm){
    return;
  }
  self.video_speaker_vm.StopTimer();
  ko.cleanNode(self.video_el);
  self.video_element.html(null);
  self.video_element = null
  self.video_el = null;
  self.video_speaker_vm = null;

  gapi.hangout.data.clearValue("hangout_speech_status");


}


VideoViewWrapper.prototype.get_current_speaker_role = function(){
  var self = this;
  return self.video_speaker_vm.get_current_speaker_role();

}

VideoViewWrapper.prototype.get_current_time = function(){
  var self = this;
  return self.video_speaker_vm.get_current_time();
}



function DefultVideoView(){
  var self = this;
  self.canvas = null;
  self.feed = null;

}

DefultVideoView.prototype.create = function(el_name){
  var self = this;

  var DefaultVideo_html_Template = _.template($('[data-template="video_area_default_template"]').html());
  self.video_element = $(el_name);
  var DefaultVideo_html_text = DefaultVideo_html_Template();
  self.video_element.html(DefaultVideo_html_text);


  self.canvas = gapi.hangout.layout.getVideoCanvas();
  self.feed = gapi.hangout.layout.getDefaultVideoFeed();



  var video_width = $("div#video_area_container_default").width() - 20;
  var offset = $("div#video_canvas_dummy_layout_default").offset()
  var height_all = offset.top + 5;

  self.canvas.setVideoFeed(self.feed);
  self.canvas.setWidth(video_width);
  self.canvas.setPosition(10,height_all);
  self.canvas.setVisible(true);
  var ratio = self.canvas.getAspectRatio();
  var video_height = video_width / ratio;

  var dummy_video_element = $("#video_canvas_dummy_layout_default");
  dummy_video_element.width(video_width);
  dummy_video_element.height(video_height);
}

DefultVideoView.prototype.remove= function(){
  var self = this;
  self.canvas = null;
  self.feed = null;
  self.video_element.html(null);
}

 function VideoViewModel(){

  var self = this;
}


VideoViewModel.prototype.initialize = function(){

  var self = this;


/*start speech area*/
  self.visible_start_speech = ko.observable(false); 
  self.start_speech_role_name_array = ko.observableArray();
  self.click_speech_start = function(data, event){
    console.log(data.button_role_name);
    var speech_obj = get_hangout_speech_status();
    if(!speech_obj){
      speech_obj = new Object();
    }
    var own_speech_obj = {hangout_id :global_own_hangout_id, role : data.button_role_name};
    speech_obj["speaker"] = own_speech_obj;
    speech_obj["poi_candidate"] = new Array();
    speech_obj["poi_speaker"] = null;
    speech_obj_str = JSON.stringify(speech_obj);

    var speech_counter = get_hangout_speech_status_counter();
    speech_counter++;
    speech_counter_str = String(speech_counter);
    var speech_id = get_guid();
    gapi.hangout.data.submitDelta({
        "hangout_speech_status": speech_obj_str,
        "hangout_speech_status_counter":speech_counter_str,
        "speech_id": speech_id
    });
  }


/* speaker info area */
  self.visible_speaker_info = ko.observable(false); 
  self.speech_role = ko.observable(); 
  self.speaker_name = ko.observable(); 
//  self.speech_time = ko.observable();
  self.timer_prefix = ko.observable();
  self.timer_value = ko.observable();

/*complete button*/
  self.visible_complete_button = ko.observable(false); 
  self.click_complete_speech = function(){
    var self = this;
    var speech_counter = get_hangout_speech_status_counter();
    speech_counter++;
    speech_counter_str = String(speech_counter);
    gapi.hangout.data.submitDelta({
          "hangout_speech_status_counter":speech_counter_str
    },["hangout_speech_status"]);
  }

/*video dummy area*/
  self.video_canvas_style_str = ko.observable();


/*poi field*/
  self.visible_poi_button = ko.observable(true);
  self.click_poi = function(){
    var self = this;
    var speech_obj = get_hangout_speech_status();
    if(!speech_obj){
      speech_obj = new Object();
    }
    if(speech_obj["poi_candidate"]){
      speech_obj["poi_candidate"].push(global_own_hangout_id);
    }else{
      speech_obj["poi_candidate"] = new Array();
      speech_obj["poi_candidate"].push(global_own_hangout_id);
    }
    speech_obj_str = JSON.stringify(speech_obj);
    var speech_counter = get_hangout_speech_status_counter();
    speech_counter++;
    speech_counter_str = String(speech_counter);
    gapi.hangout.data.submitDelta({
          "hangout_speech_status_counter":speech_counter_str,
          "hangout_speech_status": speech_obj_str
    });
    var poi_message_obj = {type:"sound", message:{type:"poi",user_id:global_own_parse_id}};
    var poi_message_str = JSON.stringify(poi_message_obj);
    gapi.hangout.data.sendMessage(poi_message_str);
    sound_mgr.play_sound_poi();
  }
  self.visible_finish_button = ko.observable(false); 

  self.finish_poi = function(){
    var self = this;
    var speech_obj = get_hangout_speech_status();
    if(!speech_obj){
      speech_obj = new Object();
    }
    if(speech_obj["poi_candidate"]){
      speech_obj["poi_candidate"] = new Array(); 
    }
    speech_obj["poi_speaker"] = null;

    speech_obj_str = JSON.stringify(speech_obj);
    var speech_counter = get_hangout_speech_status_counter();
    speech_counter++;
    speech_counter_str = String(speech_counter);

    gapi.hangout.data.submitDelta({
          "hangout_speech_status_counter":speech_counter_str,
          "hangout_speech_status": speech_obj_str
    });
    var poi_finish_message_obj = {type:"sound", message:{type:"poi_finish",user_id:global_own_parse_id}};
    var poi_finish_message_str = JSON.stringify(poi_finish_message_obj);
    gapi.hangout.data.sendMessage(poi_finish_message_str);
    sound_mgr.play_sound_poi_finish();
  }

  self.visible_finish_poi_bySpeaker = ko.observable(false); 
  self.finish_poi_bySpeaker = function(){
    var self = this;
    self.finish_poi();
  }


  self.poi_candidate_view_array = ko.observableArray();
  //self.poi_candidate_visible = ko.observable(true); 
  self.cancel_poi = function(data, event){
    var speech_obj = get_hangout_speech_status();
    if(!speech_obj){
      speech_obj = new Object();
    }
    var candidate_array = speech_obj["poi_candidate"];
    for(var i=0; i<candidate_array.length; i++ ){
      if(candidate_array[i] == global_own_hangout_id){
        delete candidate_array[i];
      }
    }
    var new_candidate_array = _.filter(candidate_array, function(hangout_id){ return hangout_id});
    speech_obj["poi_candidate"] = new_candidate_array;
    console.log(speech_obj);
    var speech_obj_str = JSON.stringify(speech_obj);
    console.log(speech_obj_str);

    var speech_counter = get_hangout_speech_status_counter();
    speech_counter++;
    speech_counter_str = String(speech_counter);

    gapi.hangout.data.submitDelta({
        "hangout_speech_status": speech_obj_str,
        "hangout_speech_status_counter":speech_counter_str
    });
  }
  self.take_poi = function(data, event){
    var speech_obj = get_hangout_speech_status();
    if(!speech_obj){
      speech_obj = new Object();
    }
    var poi_speaker_obj = {hangout_id : data.hangout_id    , role : "Poi"};
    speech_obj["poi_speaker"] = poi_speaker_obj;
    speech_obj["poi_candidate"] = new Array(); 
    speech_obj_str = JSON.stringify(speech_obj);

    var speech_counter = get_hangout_speech_status_counter();
    speech_counter++;
    speech_counter_str = String(speech_counter);

    gapi.hangout.data.submitDelta({
        "hangout_speech_status": speech_obj_str,
        "hangout_speech_status_counter":speech_counter_str
    });

    var taken_message_obj = {type:"sound", message:{type:"taken",user_id:global_own_parse_id}};
    var taken_message_str = JSON.stringify(taken_message_obj);
    gapi.hangout.data.sendMessage(taken_message_str);
    sound_mgr.play_sound_taken();
  }

  self.current_speaker = null;
  self.current_speaker_role = null;
  self.hangout_speech_status = null;
  self.timer = null;

  self.speech_duration = 0;
  self.canvas = gapi.hangout.layout.getVideoCanvas();

  self.speech_recognition = new WebSpeech_Recognition();
  self.under_recording = false;

}



VideoViewModel.prototype.update = function(){

  var self = this;
  var hangout_speech_status = get_hangout_speech_status();

  self.update_button(hangout_speech_status);
  self.update_speaker(hangout_speech_status);
  self.update_poi_candidate(hangout_speech_status);
  self.hangout_speech_status_counter = get_hangout_speech_status_counter();

}


VideoViewModel.prototype.update_speaker = function(hangout_speech_status){

  var self = this;
  self.hangout_speech_status = hangout_speech_status;
  var speaker_obj = hangout_speech_status.speaker;
  if(speaker_obj){
    speaker_obj = filter_with_existing_hangouID(speaker_obj);
    if(speaker_obj){
      self.current_speaker_role = speaker_obj.role;
    }
  }

  var poi_speaker_obj = hangout_speech_status.poi_speaker;
  if(poi_speaker_obj){
    poi_speaker_obj = filter_with_existing_hangouID(poi_speaker_obj);
  }


  if(poi_speaker_obj){
    self.OwnSpeechHaneler(poi_speaker_obj, "poi");
    //self.poi_candidate_view_array().splice(0, self.poi_candidate_view_array.length);
    self.remove_candidate_all();
    self.show_Speaker(poi_speaker_obj, "poi");
    self.OthersSpeechHaneler(poi_speaker_obj, "poi");

  }else if (speaker_obj){
    self.current_speaker_role = speaker_obj.role;
    self.OwnSpeechHaneler(speaker_obj, "speaker");
    self.StartTimer( speaker_obj.hangout_id );
    self.show_Speaker(speaker_obj, "speaker");
    self.OthersSpeechHaneler(speaker_obj, "speaker");
  }else{
    self.StopTimer();
    self.show_Speaker(null, "discussion");
    self.OwnSpeechHaneler(null, "discussion");
    self.OthersSpeechHaneler(null, "discussion");
    self.current_speaker_role = null;
  }
  debater_bar_obj.update_speaker();
  note_take_obj.update_speaker();
}

 VideoViewModel.prototype.OwnSpeechHaneler = function(speaker_obj, type){
  var self = this;

  if(!speaker_obj){
      if(self.under_recording == true){
          console.log("own speech finish");
          self.under_recording = false;
          self.speech_recognition.stop_recognition();
          recording_wrapper_obj.Speech_Finish("discussion" , self.current_speaker_role);
      }  
      return; 
  }
  if(speaker_obj.hangout_id == global_own_hangout_id ){
      if(self.under_recording){ 
          return;
      }else{
          self.under_recording = true;
          console.log("own speech start");
          var role_name = speaker_obj.role;
          self.speech_recognition.start_recognition(type); 
          recording_wrapper_obj.Speech_Start(type, self.current_speaker_role);
          return;
      }
  }else{
      if(self.under_recording == true){
          console.log("own speech finish");
          self.under_recording = false;
          self.speech_recognition.stop_recognition();
          recording_wrapper_obj.Speech_Finish("other" , self.current_speaker_role);
          return;
      }else{
          return;
      }
  }
}


 VideoViewModel.prototype.OthersSpeechHaneler = function(speaker_obj, type){

  var self = this;
  if(!speaker_obj){
    self.enable_microphone();
      return; 
  }
  if(speaker_obj.hangout_id != global_own_hangout_id ){
    console.log("other speaker speech");
    self.disable_microphone();
  }else{
    console.log("my speech");
    self.enable_microphone();
  }
 }

 VideoViewModel.prototype.enable_microphone = function(){
    var muted = gapi.hangout.av.getMicrophoneMute();
    if(muted){
       gapi.hangout.av.setMicrophoneMute(false);
      console.log("microphone turned on")
    }
}
 VideoViewModel.prototype.disable_microphone = function(){

    var muted = gapi.hangout.av.getMicrophoneMute();
    if(!muted){
      gapi.hangout.av.setMicrophoneMute(true);
      console.log("microphone turned off");
    }
}


 VideoViewModel.prototype.StartTimer = function(hangout_id){

  var self = this;
  if(self.current_speaker != hangout_id){
    // self.speech_time("speech start");
    self.timer_value("speech start");
    if(!self.timer ){
      self.timer = setInterval( function(){self.countTimer()},1000);
      console.log("start timer is" + self.timer);
    sound_mgr.play_sound_speech_start();
    }
  }
}




 VideoViewModel.prototype.get_current_time = function(){
  var self = this;
  return self.speech_duration;
 }


 VideoViewModel.prototype.get_current_speaker_role = function(){
  var self = this;
  return self.current_speaker_role;
 }



 VideoViewModel.prototype.countTimer = function(){

  var self = this;
  self.speech_duration++;
  var duration_mod = self.speech_duration % 60;
  var minutes = (self.speech_duration - duration_mod)/60;
  var second = duration_mod;
  var timer_str = minutes + "min " + second + "sec";
  //self.speech_time(timer_msg);

  if(minutes == 1 && second == 0|| minutes ==6 && second == 0){
    sound_mgr.play_sound_PinOne();
    console.log("one minutes");
  }else if(minutes ==6 && second == 0){
    sound_mgr.play_sound_PinOne();
    console.log("two minutes");
  }else if(minutes == 7  && second == 0){
    sound_mgr.play_sound_PinTwo();
    console.log("seven minutes");
  }else if(minutes == 7  && second == 30){
    sound_mgr.play_sound_PinThree();
    console.log("seven and half minutes");
  }
  self.timer_value(timer_str);
 }

 VideoViewModel.prototype.StopTimer = function(){
  var self = this;
  self.speech_duration = 0;
  //self.speech_time("");
  self.timer_value("");
  self.timer_prefix("");
  console.log("clear timer is called" + self.timer);
  clearInterval(self.timer);
  self.timer = null;
 }

 VideoViewModel.prototype.show_Speaker = function(speaker_obj, type){
  var self = this;

  var inner_content_el = document.getElementById("inner_whole");
  inner_content_el.scrollTop = 0;


  if(speaker_obj){
    var hangout_id = speaker_obj.hangout_id;
    var role_name = speaker_obj.role;
    var name = participant_mgr_obj.getName_fromHangoutID(hangout_id);
    var pict_src = participant_mgr_obj.getPictSrc_fromHangoutID(hangout_id);
    role_name  = role_name + ":   ";
    if(type=="poi"){
      self.speech_role("poi: "); 
    }else{
      self.speech_role(role_name);   
    }
    self.speaker_name(name); 
  //  self.speech_time();
    self.current_speaker = hangout_id;
 //   self.start_speech();
    self.feed = gapi.hangout.layout.createParticipantVideoFeed(hangout_id);
    self.visible_speaker_info(true);
  }else{
    // discussion mode  
    //self.speech_role("discussion mode: "); 
    //self.speaker_name(" anyone can talk");
  //  self.speech_time();
    self.current_speaker = null;
    self.feed = gapi.hangout.layout.getDefaultVideoFeed();
    self.speech_role(null);
    self.speaker_name(null); 
    self.visible_speaker_info(false);
  }



  var video_width = $("div#video_area_container").width() - 20;
  offset = $("div#video_canvas_dummy_layout").offset()
  var height_all = offset.top + 5;

  self.canvas.setVideoFeed(self.feed);
  self.canvas.setWidth(video_width);
  self.canvas.setPosition(10,height_all);
  self.canvas.setVisible(true);

  var video_height = self.canvas.getHeight() + 10;
  var width_str = String(video_width);
  var height_str = String(video_height);

  self.video_canvas_style_str("width: " + width_str + "px; height: " + height_str + "px;");

 }


 VideoViewModel.prototype.update_button = function(hangout_speech_status){
  var self = this;

  self.hangout_speech_status = hangout_speech_status;
  var speaker_hangout_id = null;
  var poi_speaker_hangout_id = null;

  var speaker_obj = hangout_speech_status.speaker;
  if(speaker_obj){
    speaker_obj = filter_with_existing_hangouID(speaker_obj);
    if(speaker_obj){
      speaker_hangout_id = speaker_obj.hangout_id;
    }
  }

  var poi_speaker_obj = hangout_speech_status.poi_speaker;
  if(poi_speaker_obj){
    poi_speaker_obj = filter_with_existing_hangouID(poi_speaker_obj);
    if(poi_speaker_obj){
     poi_speaker_hangout_id = poi_speaker_obj.hangout_id;
    }
  }

  var is_poi_speaker_yourself = participant_mgr_obj.is_your_own_hangoutid(poi_speaker_hangout_id);
  var is_speaker_yourself = participant_mgr_obj.is_your_own_hangoutid(speaker_hangout_id);
  var is_speaker_group_member = participant_mgr_obj.isYourPartner(speaker_hangout_id);
  var is_Audience_yourself = participant_mgr_obj.isAudience_yourself();
  var is_already_poied_yourself = self.is_already_poied(hangout_speech_status);
  var is_debater_yourself = participant_mgr_obj.isDebater_yourself();

  self.visible_complete_button(false);
  self.visible_poi_button(false);
  self.visible_finish_button(false);
  self.visible_finish_poi_bySpeaker(false);
  self.hide_start_speech_button();


  if(poi_speaker_hangout_id){
    if(is_poi_speaker_yourself){
      //complete poi
      self.visible_finish_button(true);
    }else{
      if(is_speaker_yourself){
        //force finish
        self.visible_finish_poi_bySpeaker(true);
      }else{
        //nothing to show
      }
    }
  }else{
    if(speaker_hangout_id){
      if(is_speaker_yourself){
        //stop speech
        //self.show_stop_speech_button();
        self.visible_complete_button(true);

      }else{
        if(is_speaker_group_member){
          //nothing to show

        }else{
          if(is_Audience_yourself){
          //nothing to show

          }else{
            if(is_already_poied_yourself){
            //nothing to show

            }else{
              // poi
              self.visible_poi_button(true);
            }
          }
        }
      }
    }else{
      if(is_debater_yourself){
        //start speech
        self.show_start_speech_button();
      }else{
        // nothing to show
        self.hide_start_speech_button();
      }
    }
  }
 }

 VideoViewModel.prototype.is_already_poied = function(hangout_speech_status){

  var poi_candidate_array = hangout_speech_status.poi_candidate;
  if(poi_candidate_array){
    for(var i=0; i< poi_candidate_array.length; i++){
      if(poi_candidate_array[i] == global_own_hangout_id){
        return true;
      }
    }
  }
  return false;

}


 VideoViewModel.prototype.show_start_speech_button = function(){
  var self = this;

  var own_role_array = participant_mgr_obj.get_own_role_array();

  if(own_role_array.length > 0){
    self.visible_start_speech(true);
  }

  for(var i=0; i< own_role_array.length; i++){
    var role_name = own_role_array[i];
    var obj = {button_role_name:role_name};
    self.start_speech_role_name_array.push(obj);
  }
 }


 VideoViewModel.prototype.hide_start_speech_button = function(){
  var self = this;
  self.start_speech_role_name_array.removeAll();
  self.visible_start_speech(false);

 }
/*
 VideoViewModel.prototype.show_stop_speech_button = function(){
  var self = this;
//  self.normal_buttons(true);
  self.visible_complete_button(true);

 }
 VideoViewModel.prototype.hide_stop_speech_button = function(){
  var self = this;
 // self.normal_buttons(false);
  self.visible_complete_button(false);

 }
*/


VideoViewModel.prototype.get_poi_candidate_array = function(){

  var self = this;
  var candidate_obj_array = self.poi_candidate_view_array();
  var candidate_hangoutid_array = new Array();
  for(var i= 0; i< candidate_obj_array.length; i++){
    candidate_hangoutid_array.push(candidate_obj_array[i].hangout_id);
  }
  return candidate_hangoutid_array;
}

VideoViewModel.prototype.update_poi_candidate = function(hangout_speech_status){

  var self = this;

  self.hangout_speech_status = hangout_speech_status;
  var next_candidate_array = hangout_speech_status.poi_candidate; 
  next_candidate_array = filter_array_with_existing_hangouID(next_candidate_array);
  var current_poi_candidate_array = self.get_poi_candidate_array();


  if( !next_candidate_array || next_candidate_array.length==0){
//    self.poi_candidate_visible(false);
    self.remove_candidate_all();
  }else{
  //  self.poi_candidate_visible(true);
    var new_poi_candidate_array = _.difference(next_candidate_array, current_poi_candidate_array);
    var remove_poi_candidate_array = _.difference(current_poi_candidate_array, next_candidate_array);
    for(var i=0; i<new_poi_candidate_array.length; i++){
      self.add_candidate(new_poi_candidate_array[i]);
    }
    for(var i=0; i<remove_poi_candidate_array.length; i++){
      self.remove_candidate(remove_poi_candidate_array[i]);
    }
  }
}


 VideoViewModel.prototype.add_candidate = function( in_hangout_id){

  var self = this;
  var name = participant_mgr_obj.getFirstName_fromHangoutID(in_hangout_id);
  var pict_src = participant_mgr_obj.getPictSrc_fromHangoutID(in_hangout_id);
  var poi_take_visible = false;
  var poi_cancel_visible = false;
  if(self.current_speaker == global_own_hangout_id){
    poi_take_visible = true
  }
  if(in_hangout_id == global_own_hangout_id){
    poi_cancel_visible = true;
  }


  self.poi_candidate_view_array.push({img_url:pict_src, name:name,PoiTake_button_visible:poi_take_visible, Cancel_button_visible:poi_cancel_visible, hangout_id: in_hangout_id});
 }


 VideoViewModel.prototype.remove_candidate = function(in_hangout_id){
  
  var self = this;
  self.poi_candidate_view_array.remove(function(item) { return item.hangout_id == in_hangout_id });
 }

 VideoViewModel.prototype.remove_candidate_all = function(){
    var self = this;
    self.poi_candidate_view_array.removeAll();
 }





