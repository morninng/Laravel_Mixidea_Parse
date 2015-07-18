
function ChatViewModel() {

  var self = this;
  self.chat_message_array = ko.observableArray();
  self.hangout_visible = ko.observable(false); 
  self.initial_message_visible = ko.observable(true); 
  self.message_visible = ko.observable(false); 
 // self.group_member_hangoutid_array = new Array();
}

ChatViewModel.prototype.initialize = function(in_hangout_id){
  
  var self = this;
  self.own_hangout_id = in_hangout_id;
  
}
/*
ChatViewModel.prototype.update_group_member = function(){

  self.group_member_hangoutid_array =  retrieve_group_hangoutid_array();

}
*/

ChatViewModel.prototype.click_sendbutton = function(data, event){

  var self = this;
  var text =  document.forms.chat_send_form.chat_textarea.value;

  if(text.length > 1){
    gapi.hangout.data.sendMessage(text);
    self.chat_message_array.push({chat_class:"message_css_own", sender_name:"Me: ", chat_message:text});
    self.initial_message_visible(false);
  }

  document.forms.chat_send_form.chat_textarea.value = "";
}

ChatViewModel.prototype.receive_message = function(received_message){

  var self = this;
  self.initial_message_visible(false);


  var sender_hangout_id = received_message.senderId;
  var message = received_message.message;
  var message_text = ":" + message;

  var message_css = null;
  var name = null;

  is_my_partner = appmgr.participant_manager_object.isYourPartner(sender_hangout_id);
  if(!is_my_partner){
    return;
  }

/*
  if(sender_hangout_id == self.own_hangout_id){
  	message_css = "message_css_own";
  	name = "Me";
  }else{
*/
  	name = appmgr.participant_manager_object.getFirstName_fromHangoutID(sender_hangout_id);
  	message_css = "message_css_others";
  // }

  self.chat_message_array.push({chat_class:"message_css_others", sender_name:name, chat_message:message_text});

}
