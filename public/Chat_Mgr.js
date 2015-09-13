
function ChatViewModel() {

  var self = this;
  self.chat_message_array = ko.observableArray();
  self.hangout_visible = ko.observable(true); 
  self.hangout_url = ko.observable(); 


  self.initial_message_visible = ko.observable(true); 
  self.message_visible = ko.observable(false); 
 // self.group_member_hangoutid_array = new Array();
}

ChatViewModel.prototype.initialize = function(in_hangout_id){
  
  var self = this;
  self.own_hangout_id = in_hangout_id;
}

ChatViewModel.prototype.update = function(){

  var self = this;
  var hangout_url_obj = appmgr.actual_game_obj.get("hangout_id");
  if(!hangout_url_obj){
    return;
  }
  self.hangout_url_obj = hangout_url_obj;
  self.show_hangout_button();
}

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

ChatViewModel.prototype.unvisible_hangout_button = function(){
  var self = this;
  self.hangout_visible(false); 
}


ChatViewModel.prototype.visible_hangout_button = function(){
  var self = this;
  self.hangout_visible(true); 
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
    var chat_message_obj = {type:"chat",message:text};
    var chat_message_str = JSON.stringify(chat_message_obj);
    gapi.hangout.data.sendMessage(chat_message_str);
    self.chat_message_array.push({chat_class:"message_css_own", sender_name:"Me: ", chat_message:text});
    self.initial_message_visible(false);
  }

  document.forms.chat_send_form.chat_textarea.value = "";
}

/*
　{type:chat:message:AAAAAAAAAAAAAAAAAAAAAaaa}
*/
ChatViewModel.prototype.receive_message = function(received_message, sender_hangout_id){

  var self = this;

  is_my_partner = appmgr.participant_manager_object.isYourPartner(sender_hangout_id);
  if(!is_my_partner){
    return;
  }
  
  var message_shown = ":" + received_message;
  var message_css = null;
  var name = null;
  name = appmgr.participant_manager_object.getFirstName_fromHangoutID(sender_hangout_id);
  message_css = "message_css_others";

  self.initial_message_visible(false);
  self.chat_message_array.push({chat_class:"message_css_others", sender_name:name, chat_message:message_shown});

}
