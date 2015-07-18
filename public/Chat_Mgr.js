
function ChatViewModel() {

  var self = this;
  self.chat_message_array = ko.observableArray();
  self.hangout_visible = ko.observable(false); 
  self.initial_message_visible = ko.observable(true); 
  self.message_visible = ko.observable(false); 
}

ChatViewModel.prototype.initialize = function(in_hangout_id){
  
  var self = this;
  self.own_hangout_id = in_hangout_id;

  var group_member_hangoutid_array =  retrieve_group_hangoutid_array();
  
}

ChatViewModel.prototype.click_sendbutton = function(data, event){

  var self = this;
  var text =  document.forms.chat_send_form.chat_textarea.value;
  self.receive_message(text);  //ここは、実際にはhangoutのメッセージを送信だが、今はテストなので、受け取りの関数を呼び出す。
  document.forms.chat_send_form.chat_textarea.value = "";
}

ChatViewModel.prototype.receive_message = function(text){

  var self = this;
  self.initial_message_visible(false);

  var sender_hangout_id = "hangout_XXX3";
  var message_text = ":" + text;
  var message_css = null;
  var name = null;

  if(sender_hangout_id == self.own_hangout_id){
  	message_css = "message_css_own";
  	name = "Me";
  }else{
  	name = appmgr.participant_manager_object.getFirstName_fromHangoutID(sender_hangout_id);
  	message_css = "message_css_others";
  }

  self.chat_message_array.push({chat_class:message_css, sender_name:name, chat_message:message_text});

}
