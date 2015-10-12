function ChatVM_wrapper() {


}

ChatVM_wrapper.prototype.create = function(el_name){
  var self = this;

  if(self.chat_vm_obj){
    return;
  }

  var Chat_html_Template = _.template($('[data-template="chat_template"]').html());
  self.chat_element = $(el_name);
  var Chat_html_text = Chat_html_Template();
  self.chat_element.html(Chat_html_text);

  self.chat_vm_obj = new ChatViewModel();
  self.chat_el = document.getElementById('chat_field');
  ko.applyBindings(self.chat_vm_obj, self.chat_el);

  self.chat_vm_obj.update();

}


ChatVM_wrapper.prototype.remove = function(){
  var self = this;

  if(!self.chat_vm_obj){
    return;
  }
  ko.cleanNode(self.chat_el);
  self.chat_element.html(null);
  self.chat_vm_obj = null;
  self.chat_el = null;
}

ChatVM_wrapper.prototype.receive_message = function(received_message, sender_hangout_id){
  var self = this;
  if(!self.chat_vm_obj){
    return;
  }
  self.chat_vm_obj.receive_message(received_message, sender_hangout_id);
}

ChatVM_wrapper.prototype.update_from_server = function(){
  var self = this;
  if(!self.chat_vm_obj){
    return;
  }
  self.chat_vm_obj.update();
}



function ChatViewModel() {

  var self = this;

  self.same_member_parseid_array = new Array();
  self.chat_text_input = ko.observable();
  self.chat_message_array = ko.observableArray();
  self.chat_header_title = ko.observable();
  self.visible_maximize_button = ko.observable(false);
  self.visible_collapse_button = ko.observable(true);

  self.team_side_str = null;

}

ChatViewModel.prototype.update = function(){
  
  var self = this;

  var team_side_str = participant_mgr_obj.get_own_group_name();
  var title_bar = "chatroom among " + team_side_str;
  self.chat_header_title(title_bar);
  if(team_side_str != self.team_side_str){

    self.chat_message_array.removeAll();
    self.team_side_str = team_side_str;
  }

}


ChatViewModel.prototype.click_collapse = function(){
  var self = this;
   $('#msg_wrap').slideUp("slow");
  self.visible_maximize_button(true);
  self.visible_collapse_button(false);
}

ChatViewModel.prototype.click_expand = function(){

  var self = this;
   $('#msg_wrap').slideDown("slow");
  self.visible_maximize_button(false);
  self.visible_collapse_button(true);
}


/*
ChatViewModel.prototype.update = function(){

  var self = this;
  var hangout_url_obj = appmgr.actual_game_obj.get("hangout_id");
  if(!hangout_url_obj){
    return;
  }
  self.hangout_url_obj = hangout_url_obj;
  self.show_hangout_button();
}
*/
/*

ChatViewModel.prototype.show_hangout_button = function(){

  var self = this;
  var own_group_name = appmgr.participant_manager_object.get_own_group_name();
  var hangout_domain = self.hangout_url_obj[own_group_name];

  var team_disucussion_hangout_appid = "918649959098";
  var game_id = appmgr.game_id;
  var hangout_query_key = "&gd=";
  var hangout_query_value = "?gid=";
  var hangout_gid = "?gid=";
  var hangout_query_split = "_";
  var first_query_value = global_own_parse_id;
  var second_query_value = global_debate_game_id;
  var third_query_value = global_original_hangout_appid;
  var fourth_query_value = own_group_name;
  var hangout_link_str= hangout_domain + hangout_gid + team_disucussion_hangout_appid
               + hangout_query_key + first_query_value + hangout_query_split
                + second_query_value + hangout_query_split + third_query_value
                + hangout_query_split + fourth_query_value;

  self.hangout_url(hangout_link_str);
  console.log(hangout_link_str);

}
*/
/*
ChatViewModel.prototype.unvisible_hangout_button = function(){
  var self = this;
  self.hangout_visible(false); 
}
*/
/*
ChatViewModel.prototype.visible_hangout_button = function(){
  var self = this;
  self.hangout_visible(true); 
}
*/


/*
ChatViewModel.prototype.update_group_member = function(){

  self.group_member_hangoutid_array =  retrieve_group_hangoutid_array();

}
*/


ChatViewModel.prototype.onEnterTextbox = function(data, event){

  var self = this;

  if(event.keyCode === 13 ){
    var text_message = self.chat_text_input();
    if(text_message.length>1){
      self.send_hangout_message(text_message);
      self.show_own_message(text_message);
      self.chat_text_input(null);
      $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    }
  }
}
ChatViewModel.prototype.show_own_message = function(text_message){

  var self = this;
  var chat_message_obj = {chat_message:text_message, chat_box_class:"chat_msg_own", sender_name:""}
  self.chat_message_array.push(chat_message_obj);
}

ChatViewModel.prototype.send_hangout_message = function(text){
  var self = this;
  var chat_message_obj = {type:"chat",message:text};
  var chat_message_str = JSON.stringify(chat_message_obj);
  gapi.hangout.data.sendMessage(chat_message_str);
}


      /*
  var text =  document.forms.chat_send_form.chat_textarea.value;

  if(text.length > 1){
    var chat_message_obj = {type:"chat",message:text};
    var chat_message_str = JSON.stringify(chat_message_obj);
    gapi.hangout.data.sendMessage(chat_message_str);
    self.chat_message_array.push({chat_class:"message_css_own", sender_name:"Me: ", chat_message:text});
    self.initial_message_visible(false);
  }

  document.forms.chat_send_form.chat_textarea.value = "";
  */





/*
　{type:chat:message:AAAAAAAAAAAAAAAAAAAAAaaa}
*/
ChatViewModel.prototype.receive_message = function(received_message, sender_hangout_id){

  var self = this;

  is_my_partner = participant_mgr_obj.isYourPartner(sender_hangout_id);
  if(!is_my_partner){
    return;
  }
  $('#msg_wrap').slideDown("slow");
  self.visible_maximize_button(false);
  self.visible_collapse_button(true);

  var message_shown = ":" + received_message;
  var name = participant_mgr_obj.getFirstName_fromHangoutID(sender_hangout_id);

  var chat_message_obj = {chat_box_class:"chat_msg_other", sender_name:name, chat_message:message_shown}
  self.chat_message_array.push(chat_message_obj);

  $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);

}
