function Construct_Layout(){
    var self = this;
    self.status = "introduction";
    self.first_layout_construction = false;
}

Construct_Layout.prototype.update_from_server = function(){

  var self = this;
  if(self.status != actual_game_obj.get("game_status")){
    self.update_structure();
  }
  return;
}

Construct_Layout.prototype.get_status = function(){
  var self = this;
  return self.status;
}

Construct_Layout.prototype.update_structure = function(){

  var self = this;

  self.status = actual_game_obj.get("game_status");

	if(!self.first_layout_construction){
  	self.construct_common_layout();
  }else{
    sound_mgr.play_sound_Cursol();
  }


  switch(self.status){
    case "introduction":
        self.construct_layout_introduction();
    break;
    case "preparation":
        self.construct_layout_preparation();
    break;
    case "debate":
        self.construct_layout_debate();
    break;
    case "reflection":
        self.construct_layout_reflection();
    break;
    case "complete":

    break;
  }
  /*
  var parent_size = $("#whole").parent().height() + ;
  $("#inner_whole").height(parent_size);
*/
  self.first_layout_construction = true;

}


Construct_Layout.prototype.construct_common_layout = function(){

  var self = this;


  status_bar_html_Template = _.template($('[data-template="status_bar_template"]').html());
  var status_bar_element = $("#container_second_top");
  var status_bar_html_text = status_bar_html_Template();
  status_bar_element.html(status_bar_html_text);



}

Construct_Layout.prototype.construct_layout_introduction = function(){

/* adjust the structure*/
  $("#container_main_left_above_right").css('display','');
  $("#container_main_left_below").css('display','');
  $("#container_main_left_above").css('display','');
  $("#container_main_left").css('display','');
  $("#top_right").html("");
  $("#container_main").width(1000);

/*update the status bar*/
  $(".status_bar").removeClass("status_bar_element");
  $(".status_bar").removeClass("status_bar_element_last");
  $(".status_bar").removeClass("status_bar_element_selected");
  $(".status_bar").removeClass("status_bar_element_last_selected");
  $(".status_bar").removeClass("status_bar_element_smaller");
  $(".status_bar").removeClass("status_bar_element_last_smaller");
  $(".status_bar").removeClass("status_bar_element_selected_smaller");
  $(".status_bar").removeClass("status_bar_element_last_selected_smaller");

  $("#status_intro").addClass("status_bar_element_selected");
  $("#status_prep").addClass("status_bar_element");
  $("#status_debate").addClass("status_bar_element");
  $("#status_reflec").addClass("status_bar_element");
  $("#status_complete").addClass("status_bar_element_last");

/*remove unnecessary object*/
  transcript_box_obj.hide();
  preparation_time.hide();
  impression_wrapper_obj.remove();
  link_to_teamdisucuss_obj.remove_Link();
  title_view_model_wrapper.remove_fixed_title("#top_left");
  after_debate_obj.remove();
  note_take_obj.remove();
  discussion_note_obj.removeAll();
  video_view_wrapper.remove_SpeakerView();
  debater_bar_obj.Delete();


  $("#container_main_left_above_right").width(250);
	var PrepDirect_html_Template = _.template($('[data-template="introduction_direction_template"]').html());
  var PrepDirect_element = $("#container_main_left_above_right");
  var PrepDirect_html_text = PrepDirect_html_Template();
  PrepDirect_element.html(PrepDirect_html_text);

  $("#container_main_left_below").width(550);
	intro_info_html_Template = _.template($('[data-template="intro_info_template"]').html());
	var intro_info_element = $("#container_main_left_below");
	var intro_info_html_text = intro_info_html_Template();
	intro_info_element.html(intro_info_html_text);


  title_view_model_wrapper.update_editable("#top_left");

  $("#container_main_right").width(550);
  participant_table.update_table("#container_main_right");

  $("#container_main_left_above_left").width(300);
  video_view_wrapper.show_defaultView("#container_main_left_above_left_up");

  chat_wrapper_obj.create("#absolute_pain_1");
}



Construct_Layout.prototype.construct_layout_preparation = function(){


/*remove unnecessary object*/
  title_view_model_wrapper.remove_fixed_title("#top_left");
  impression_wrapper_obj.remove();
  after_debate_obj.remove();
  note_take_obj.remove();
  discussion_note_obj.removeAll();
  video_view_wrapper.remove_SpeakerView();
  transcript_box_obj.hide();
  debater_bar_obj.Delete();


/* adjust the structure*/
  $("#container_main_left_above_right").css('display','');
  $("#container_main_left_below").css('display','');
  $("#top_right").html("");


/*update the status bar*/


  $(".status_bar").removeClass("status_bar_element");
  $(".status_bar").removeClass("status_bar_element_last");
  $(".status_bar").removeClass("status_bar_element_selected");
  $(".status_bar").removeClass("status_bar_element_last_selected");
  $(".status_bar").removeClass("status_bar_element_smaller");
  $(".status_bar").removeClass("status_bar_element_last_smaller");
  $(".status_bar").removeClass("status_bar_element_selected_smaller");
  $(".status_bar").removeClass("status_bar_element_last_selected_smaller");

  $("#status_intro").addClass("status_bar_element");
  $("#status_prep").addClass("status_bar_element_selected");
  $("#status_debate").addClass("status_bar_element");
  $("#status_reflec").addClass("status_bar_element");
  $("#status_complete").addClass("status_bar_element_last");


  $("#container_main_left_above_right").width(250);
  var PrepDirect_html_Template = _.template($('[data-template="preparation_direction_template"]').html());
  var PrepDirect_element = $("#container_main_left_above_right");
  var PrepDirect_html_text = PrepDirect_html_Template();
  PrepDirect_element.html(PrepDirect_html_text);
  preparation_time.show();




  var is_Audience_yourself = participant_mgr_obj.isAudience_yourself();

  if(is_Audience_yourself){

    $("#container_main_left_below").width(550);
    prep_info_html_Template = _.template($('[data-template="prep_info_audience_template"]').html());
    var prep_info_element = $("#container_main_left_below");
    var prep_info_html_text = prep_info_html_Template();
    prep_info_element.html(prep_info_html_text);
  }else{

    $("#container_main_left_below").width(550);
    prep_info_html_Template = _.template($('[data-template="prep_info_debater_template"]').html());
    var prep_info_element = $("#container_main_left_below");
    var prep_info_html_text = prep_info_html_Template();
    prep_info_element.html(prep_info_html_text);
  }


  title_view_model_wrapper.update_editable("#top_left");

  $("#container_main_right").width(550);
  participant_table.update_table("#container_main_right");


  $("#link_team_room").width(200);
  link_to_teamdisucuss_obj.show_Link("#link_team_room");


  $("#container_main_left_above_left").width(300);
  video_view_wrapper.show_defaultView("#container_main_left_above_left_up");

  chat_wrapper_obj.create("#absolute_pain_1");
}


Construct_Layout.prototype.construct_layout_debate = function(){

  console.log("construct_layout_debate");


/*remove unnecessary object*/
  link_to_teamdisucuss_obj.remove_Link();
  title_view_model_wrapper.remove_editable();
  participant_table.remove_table();
  video_view_wrapper.remove_defaultView();
  preparation_time.hide();

/* adjust the structure*/
  var self = this;
  $("#container_main_left_above_right").html(null);
  $("#container_main_left_above_right").css('display','none');
  $("#container_main_left_below").html(null);
  $("#container_main_left_below").css('display','none');
  $("#container_main").width(1000);
  $("#container_main_right").width(700);


/*update the status bar*/

  $(".status_bar").removeClass("status_bar_element");
  $(".status_bar").removeClass("status_bar_element_last");
  $(".status_bar").removeClass("status_bar_element_selected");
  $(".status_bar").removeClass("status_bar_element_last_selected");
  $(".status_bar").removeClass("status_bar_element_smaller");
  $(".status_bar").removeClass("status_bar_element_last_smaller");
  $(".status_bar").removeClass("status_bar_element_selected_smaller");
  $(".status_bar").removeClass("status_bar_element_last_selected_smaller");

  $("#status_intro").addClass("status_bar_element_smaller");
  $("#status_prep").addClass("status_bar_element_smaller");
  $("#status_debate").addClass("status_bar_element_selected_smaller");
  $("#status_reflec").addClass("status_bar_element_smaller");
  $("#status_complete").addClass("status_bar_element_last_smaller");




  $("#top_right").width(250);
  var GotoReflection_Template = _.template($('[data-template="goto_reflection_template"]').html());
  var goto_reflection_element = $("#top_right");
  var GotoReflection_html_text = GotoReflection_Template();
  goto_reflection_element.html(GotoReflection_html_text);


  title_view_model_wrapper.update_fixed_title("#top_left");

  impression_wrapper_obj.add("#container_main_left_above_left_below");

  discussion_note_obj.CreateLayout_debating("#container_main_right");
  note_take_obj.createDom("#argument_painNoteTaking");
  discussion_note_obj.fit_layout_forScroll();
  $("#discussion_note_container").scroll(function () {
    discussion_note_obj.fit_layout_forScroll();
  });


  $("#container_main_left_above_left").width(300);
  video_view_wrapper.show_SpeakerView("#container_main_left_above_left_up");

  transcript_box_obj.show("#absolute_pain_2");

  chat_wrapper_obj.create("#absolute_pain_1");
  debater_bar_obj.CreateBar("#absolute_pain_3");




}




Construct_Layout.prototype.construct_layout_reflection = function(){

  var self = this;

/*remove unnecessary object*/
  link_to_teamdisucuss_obj.remove_Link();

  title_view_model_wrapper.remove_editable();
  impression_wrapper_obj.remove();
  video_view_wrapper.remove_SpeakerView();
  video_view_wrapper.hide_video();
  chat_wrapper_obj.remove();
  debater_bar_obj.Delete();

/* adjust the structure*/
  $("#container_main_left_above_right").html(null);
  $("#container_main_left_above_right").css('display','none');
  $("#container_main_left_below").html(null);
  $("#container_main_left_below").css('display','none');
//  $("#container_main_left_above").html(null);
  $("#container_main_left_above").css('display','none');
 // $("#container_main_left").html(null);
  $("#container_main_left").css('display','none');
  $("#container_main").width('100%');
  $("#container_main_right").width('100%');


/*update the status bar*/

  $(".status_bar").removeClass("status_bar_element");
  $(".status_bar").removeClass("status_bar_element_last");
  $(".status_bar").removeClass("status_bar_element_selected");
  $(".status_bar").removeClass("status_bar_element_last_selected");
  $(".status_bar").removeClass("status_bar_element_smaller");
  $(".status_bar").removeClass("status_bar_element_last_smaller");
  $(".status_bar").removeClass("status_bar_element_selected_smaller");
  $(".status_bar").removeClass("status_bar_element_last_selected_smaller");

  $("#status_intro").addClass("status_bar_element_smaller");
  $("#status_prep").addClass("status_bar_element_smaller");
  $("#status_debate").addClass("status_bar_element_smaller");
  $("#status_reflec").addClass("status_bar_element_selected_smaller");
  $("#status_complete").addClass("status_bar_element_smaller");



  $("#top_right").width(250);
  var GotoComplete_Template = _.template($('[data-template="goto_complete_template"]').html());
  var goto_complete_element = $("#top_right");
  var GotoComplete_html_text = GotoComplete_Template();
  goto_complete_element.html(GotoComplete_html_text);


  discussion_note_obj.CreateLayout_reflection("#container_main_right");
  after_debate_obj.create("#argument_painReflection");
  note_take_obj.createDom("#argument_painNoteTaking");


  title_view_model_wrapper.update_fixed_title("#top_left");


}

