 function VideoViewModel(own_hangout_id){

  var self = this;

  self.speech_visible = ko.observable(false);
  self.speech_role = ko.observable(); 
  self.speaker_name = ko.observable(); 
  self.speech_time = ko.observable();

  self.normal_buttons = ko.observable(false);
  self.complete_speech_button = ko.observable(false); 
  self.poi_button = ko.observable(false); 
  self.finish_poi_button = ko.observable(false); 
  self.finish_poi_bySpeaker_button = ko.observable(false); 
    
  self.start_speech_button_visible = ko.observable(false); 
  self.role_name_array = ko.observableArray();
  
  self.poi_candidate_visible = ko.observable(true); 
  self.poi_candidate_view_array = ko.observableArray();

  self.current_speaker = null;
  self.own_hangout_id = own_hangout_id;

  self.speech_duration = 0;
  self.canvas = gapi.hangout.layout.getVideoCanvas();


  self.click_speech_start = function(data, event){
    console.log(data.button_role_name);
    var speech_obj = get_hangout_speech_status();
    if(!speech_obj){
      speech_obj = new Object();
    }
    var own_speech_obj = {hangout_id :self.own_hangout_id, role : data.button_role_name};
    speech_obj["speaker"] = own_speech_obj;
    speech_obj_str = JSON.stringify(speech_obj);

    var speech_counter = get_hangout_speech_status_counter();
    speech_counter++;
    speech_counter_str = String(speech_counter);

    gapi.hangout.data.submitDelta({
        "hangout_speech_status": speech_obj_str,
        "hangout_speech_status_counter":speech_counter_str
    });
  }




 }

VideoViewModel.prototype.update_speaker = function(hangout_speech_status){

  var self = this;
  var speaker_obj = hangout_speech_status.speaker;
  if(speaker_obj){
    speaker_obj = filter_with_existing_hangouID(speaker_obj);
  }

  var poi_speaker_obj = hangout_speech_status.poi_speaker;
  if(poi_speaker_obj){
    poi_speaker_obj = filter_with_existing_hangouID(poi_speaker_obj);
  }


  if(poi_speaker_obj){
    self.poi_candidate_view_array().splice(0, self.poi_candidate_view_array.length);
    self.hide_start_speech_button();
    self.show_Speaker(poi_speaker_obj, "poi");

  }else if (speaker_obj){
    self.show_Speaker(speaker_obj, "speaker");
    self.hide_start_speech_button();
    self.show_stop_speech_button();
    self.StartTimer( speaker_obj.hangout_id );
  }else{
    self.StopTimer();
    self.show_start_speech_button();
    self.hide_stop_speech_button();
    self.show_Speaker(null, "discussion");
  }
}


 VideoViewModel.prototype.StartTimer = function(hangout_id){

  var self = this;
  if(self.current_speaker != hangout_id){
    self.timer = setInterval( function(){self.countTimer()},1000)
  }

}

 VideoViewModel.prototype.countTimer = function(){

  var self = this;
  self.speech_duration++;
  var duration_mod = self.speech_duration % 60;
  var minutes = (self.speech_duration - duration_mod)/60;
  var second = duration_mod;
  var timer_msg = "time spent:   " + minutes + "min " + second + "sec";
  self.speech_time(timer_msg);
 }

 VideoViewModel.prototype.StopTimer = function(){
    var self = this;
    self.speech_duration = 0;
    self.speech_time("");
    clearInterval(self.timer);
 }

 VideoViewModel.prototype.show_Speaker = function(speaker_obj, type){
  var self = this;

  if(speaker_obj){
    var hangout_id = speaker_obj.hangout_id;
    var role_name = speaker_obj.role;
    var name = appmgr.participant_manager_object.getName_fromHangoutID(hangout_id);
    var pict_src = appmgr.participant_manager_object.getPictSrc_fromHangoutID(hangout_id);
    role_name  = role_name + ":   ";
    self.speech_visible(true);
    if(type=="poi"){
      self.speech_role("poi: "); 
    }else{
      self.speech_role(role_name);   
    }
    self.speaker_name(name); 
    self.speech_time();
    self.current_speaker = hangout_id;
 //   self.start_speech();
    self.feed = gapi.hangout.layout.createParticipantVideoFeed(hangout_id);

  }else{
    // discussion mode  
    self.speech_visible(true);
    self.speech_role("discussion mode: "); 
    self.speaker_name(" anyone can talk");
    self.speech_time();
    self.feed = gapi.hangout.layout.getDefaultVideoFeed();
  }

  var height_title = $("div#event_left").height() ;
  console.log("title height = ", height_title);
  var height_left_container = $("div#container_left_pain").height();
  console.log("left container height = ", height_left_container);
  var height_all = height_title + height_left_container;
  var width = $("div#container_left_pain").width() - 20;
  self.canvas.setVideoFeed(self.feed);
  self.canvas.setWidth(width);
  self.canvas.setPosition(10,height_all + 43);
  self.canvas.setVisible(true);


 }

 VideoViewModel.prototype.show_start_speech_button = function(){
  var self = this;

  var own_role_array = appmgr.participant_manager_object.get_own_role_array();

  if(own_role_array.length > 0){
    self.start_speech_button_visible(true);
  }

  for(var i=0; i< own_role_array.length; i++){
    var role_name = own_role_array[i];
    var obj = {button_role_name:role_name};
    self.role_name_array.push(obj);
  }
 }


 VideoViewModel.prototype.hide_start_speech_button = function(){
  var self = this;
  self.role_name_array.removeAll();
  self.start_speech_button_visible(false);

 }

 VideoViewModel.prototype.show_stop_speech_button = function(){
  var self = this;
  self.normal_buttons(true);
  self.complete_speech_button(true);

 }
 VideoViewModel.prototype.hide_stop_speech_button = function(){
  var self = this;
  self.normal_buttons(false);
  self.complete_speech_button(false);

 }




VideoViewModel.prototype.update_poi_candidate = function(hangout_speech_status){

  var self = this;
 // var _ = require('lodash');
  var next_candidate_array = hangout_speech_status.poi_candidate; 
  var current_poi_candidate_array = self.poi_candidate_view_array()


  if( !next_candidate_array || next_candidate_array.length==0){
    self.poi_candidate_visible(false);
    self.poi_candidate_view_array();
  }else{
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
  var name = appmgr.participant_manager_object.getName_fromHangoutID(in_hangout_id);
  var pict_src = appmgr.participant_manager_object.getPictSrc_fromHangoutID(in_hangout_id);
  var poi_take_visible = false;
  var poi_cancel_visible = false;
  if(self.current_speaker == self.own_hangout_id){
    poi_take_visible = true
  }
  if(in_hangout_id == self.own_hangout_id){
    poi_cancel_visible = true;
  }


  self.poi_candidate_view_array.push({img_url:pict_src, name:name,PoiTake_button_visible:poi_take_visible, cancel_button_visible:poi_cancel_visible, hangout_id: in_hangout_id});
 }


 VideoViewModel.prototype.remove_candidate = function(in_hangout_id){
  
  var self = this;
  self.poi_candidate_view_array.remove(function(item) { return item.hangout_id == in_hangout_id });
 }

  VideoViewModel.prototype.remove_candidate_all = function(in_hangout_id){
  var self = this;
  }


 VideoViewModel.prototype.take_poi = function(data, event){
  var self = this;
  console.log(data.hangout_id);
 }





 VideoViewModel.prototype.click_complete_speech = function(){
  var self = this;
  
  var speech_counter = get_hangout_speech_status_counter();
  speech_counter++;
  speech_counter_str = String(speech_counter);

  gapi.hangout.data.submitDelta({
        "hangout_speech_status_counter":speech_counter_str
  },["hangout_speech_status"]);

 }

 VideoViewModel.prototype.click_poi = function(){
  var self = this;
 
 }

 VideoViewModel.prototype.finish_poi = function(){
  var self = this;
 
 }

 VideoViewModel.prototype.finish_poi_bySpeaker = function(){
  var self = this;
 
 }

 VideoViewModel.prototype.updateModel = function(){
   var self = this;
   self.speech_visible(true);
 }

