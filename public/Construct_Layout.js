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
  self.own_group_name = participant_mgr_obj.get_own_group_name();
  self.is_audience_yourself = participant_mgr_obj.isAudience_yourself()

	if(!self.first_layout_construction){
  	self.construct_common_layout();
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
    case "evaluation":

    break;
    case "complete":

    break;
  }
}


Construct_Layout.prototype.construct_common_layout = function(){

  var self = this;


  status_bar_html_Template = _.template($('[data-template="status_bar_template"]').html());
  var status_bar_element = $("#container_second_top");
  var status_bar_html_text = status_bar_html_Template();
  status_bar_element.html(status_bar_html_text);


  var Chat_html_Template = _.template($('[data-template="chat_template"]').html());
  var chat_element = $("#absolute_pain_1");
  var Chat_html_text = Chat_html_Template();
  chat_element.html(Chat_html_text);

  chat_view_model = new ChatViewModel();
  chat_view_model.update();
  var chat_el = document.getElementById('chat_field');
  ko.applyBindings(chat_view_model, chat_el);

}

Construct_Layout.prototype.construct_layout_debate = function(){

  console.log("construct_layout_debate");

  var self = this;
  $("#container_main_left_above_right").css('display','none');
  $("#container_main_left_below").css('display','none');
  $("#container_main").width(1200);
  $("#container_main_right").width(900);

  link_to_teamdisucuss_obj.remove_Link();

  title_view_model_wrapper.remove_editable("#top_left");
  title_view_model_wrapper.update_fixed_title("#top_left");

 impression_wrapper_obj.add("#container_main_left_above_left_below");

  participant_table.remove_table();


 var discussion_note_setting = new Object();
 var template_name = null;
  if(self.is_audience_yourself){

    discussion_note_setting = {
    Arg:[
        {
          team_name:"Gov", 
          element:"#argument_pain",
          template:"argument_template",
          comment_query_array:[self.own_group_name]
        }
      ]
    }
    template_name = "discussion_single_template";

  }else{
    discussion_note_setting = {
    Arg:[
        {
          team_name:self.own_group_name, 
          element:"#argument_pain",
          template:"argument_template",
          comment_query_array:[self.own_group_name]
        }
      ]
    }
    template_name = "discussion_single_template";
  }
  template_name = "[data-template='" + template_name + "']";
  var discussion_Note_Template = _.template($(template_name).html());
  var discussion_note_element = $("#container_main_right");
  var discussion_note_html_text = discussion_Note_Template();
  discussion_note_element.html(discussion_note_html_text);

  discussion_note_obj.initialize(discussion_note_setting);


  $("#top_right").width(250);
  var GotoReflection_Template = _.template($('[data-template="goto_reflection_template"]').html());
  var goto_reflection_element = $("#top_right");
  var GotoReflection_html_text = GotoReflection_Template();
  goto_reflection_element.html(GotoReflection_html_text);



  $("#status_debate").removeClass("status_bar_element");
  $("#status_debate").addClass("status_bar_element_selected");

  video_view_wrapper.remove_defaultView();
  $("#container_main_left_above_left").width(300);
  video_view_wrapper.show_SpeakerView("#container_main_left_above_left_up");

  transcript_box_obj.show("#absolute_pain_2");



  preparation_time.hide();

}

Construct_Layout.prototype.construct_layout_introduction = function(){


  $("#container_main_left_above_right").css('display','');
  $("#container_main_left_below").css('display','');
  $("#top_right").html("");

  impression_wrapper_obj.remove();
 
  link_to_teamdisucuss_obj.remove_Link();

  title_view_model_wrapper.remove_fixed_title("#top_left");
  title_view_model_wrapper.update_editable("#top_left");



  $("#container_main").width(1000);



  // $("#container_main_left_above_right").height(left_height);
 // $("#container_main_left_above_right").height(230);
  $("#container_main_left_above_right").width(250);
	var PrepDirect_html_Template = _.template($('[data-template="introduction_direction_template"]').html());
  var PrepDirect_element = $("#container_main_left_above_right");
  var PrepDirect_html_text = PrepDirect_html_Template();
  PrepDirect_element.html(PrepDirect_html_text);

  $("#container_main_right").width(450);
  participant_table.update_table("#container_main_right");





  $("#container_main_left_below").width(550);
	intro_info_html_Template = _.template($('[data-template="intro_info_template"]').html());
	var intro_info_element = $("#container_main_left_below");
	var intro_info_html_text = intro_info_html_Template();
	intro_info_element.html(intro_info_html_text);


  $("#status_intro").removeClass("status_bar_element");
  $("#status_intro").addClass("status_bar_element_selected");


  $("#container_main_left_above_left").width(300);
  video_view_wrapper.remove_SpeakerView();
  video_view_wrapper.show_defaultView("#container_main_left_above_left_up");
  
  transcript_box_obj.hide();
  preparation_time.hide();
}



Construct_Layout.prototype.construct_layout_preparation = function(){


  $("#container_main_left_above_right").css('display','');
  $("#container_main_left_below").css('display','');
  $("#top_right").html("");


  title_view_model_wrapper.remove_fixed_title("#top_left");
  title_view_model_wrapper.update_editable("#top_left");

  impression_wrapper_obj.remove();
 

  $("#container_main_right").width(450);
  participant_table.update_table("#container_main_right");


  $("#status_prep").removeClass("status_bar_element");
  $("#status_prep").addClass("status_bar_element_selected");

/* ********** */
 // $("#container_main_left_above_right").height(230);
  $("#container_main_left_above_right").width(250);
  var PrepDirect_html_Template = _.template($('[data-template="preparation_direction_template"]').html());
  var PrepDirect_element = $("#container_main_left_above_right");
  var PrepDirect_html_text = PrepDirect_html_Template();
  PrepDirect_element.html(PrepDirect_html_text);


  $("#container_main_left_below").width(550);
  intro_info_html_Template = _.template($('[data-template="prep_info_audience_template"]').html());
//    intro_info_html_Template = _.template($('[data-template="prep_info_debater_template"]').html());
  var intro_info_element = $("#container_main_left_below");
  var intro_info_html_text = intro_info_html_Template();
  intro_info_element.html(intro_info_html_text);


  $("#container_main_left_above_left").width(300);
  video_view_wrapper.remove_SpeakerView();
  video_view_wrapper.show_defaultView("#container_main_left_above_left_up");

  $("#link_team_room").width(200);
  link_to_teamdisucuss_obj.show_Link("#link_team_room");

  transcript_box_obj.hide();
  preparation_time.show();
}

