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

  var Title_html_Template = _.template($('[data-template="title_template"]').html());
  var title_element = $("#top_left");
  var Title_html_text = Title_html_Template();
  title_element.html(Title_html_text);
  var title_el = document.getElementById('title_template_area');
  ko.applyBindings(title_view_model, title_el);
  title_view_model.initialize();

  status_bar_html_Template = _.template($('[data-template="status_bar_template"]').html());
  var status_bar_element = $("#container_second_top");
  var status_bar_html_text = status_bar_html_Template();
  status_bar_element.html(status_bar_html_text);



  $("#container_main_left_above_left").width(300);
  var Video_html_Template = _.template($('[data-template="video_area_template"]').html());
  var video_element = $("#container_main_left_above_left_up");
  var Video_html_text = Video_html_Template();
  video_element.html(Video_html_text);
  video_view_model.initialize();
  var video_el = document.getElementById('video_area_container');
  ko.applyBindings(video_view_model, video_el);
  video_view_model.update();


  var Impression_html_Template = _.template($('[data-template="impression_template"]').html());
  var impression_element = $("#container_main_left_above_left_below");
  var impression_html_text = Impression_html_Template();
  impression_element.html(impression_html_text);
	self.impression_mgr = new ImpressionMgr();
  var impression_el = document.getElementById('impression_container');
  ko.applyBindings(self.impression_mgr , impression_el);

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


  transcription_mgr = new TranscriptionMgr();
  transcription_mgr.initialize();

/*not original from here*/



}

Construct_Layout.prototype.construct_layout_introduction = function(){


  $("#container_main_left_above_right").css('display','');
  $("#container_main_left_below").css('display','');
  $("#top_right").html("");




  $("#container_main").width(1000);



  // var left_height = $("#container_main_left_above_left_below").height() + $("#container_main_left_above_left_up").height();

  // $("#container_main_left_above_right").height(left_height);
  $("#container_main_left_above_right").height(230);
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



}



Construct_Layout.prototype.construct_layout_preparation = function(){


  $("#container_main_left_above_right").css('display','');
  $("#container_main_left_below").css('display','');
  $("#top_right").html("");


  $("#container_main_right").width(450);
  participant_table.update_table("#container_main_right");


  $("#status_prep").removeClass("status_bar_element");
  $("#status_prep").addClass("status_bar_element_selected");

/* ********** */
  $("#container_main_left_above_right").height(230);
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

}


Construct_Layout.prototype.count_timer_start = function(start_time) {
	var self = this;
    clearInterval(self.timer);
	self.timer = setInterval( function(){self.count_timer_show(start_time)}, 1000);
}

Construct_Layout.prototype.count_timer_show = function(start_time) {
	var self = this;
	var current_time = new Date();
	var elapsed_time = current_time - start_time;
	var elapled_second = elapsed_time/1000
	var elapsed_hour = elapled_second/60/60;
	elapsed_hour = Math.floor(elapsed_hour);
	var elapsed_minute = (elapled_second - elapsed_hour*60*60)/60;
	elapsed_minute = Math.floor(elapsed_minute);

	elapled_second = elapled_second - elapsed_hour*60*60 - elapsed_minute*60;
	elapled_second = Math.floor(elapled_second);

	elapled_second = ("0" + elapled_second).slice(-2);
	elapsed_minute = ("0" + elapsed_minute).slice(-2);

	self.preparation_time(elapsed_minute + ":" + elapled_second + " has passed");


}

Construct_Layout.prototype.count_timer_hide = function() {

	var self = this;
	self.preparation_time(null);
    clearInterval(self.timer);

}


