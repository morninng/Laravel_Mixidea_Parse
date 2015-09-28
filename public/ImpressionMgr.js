function Impression_wrapper(){
  var self = this;
  self.impression_vm_obj = null;
}

Impression_wrapper.prototype.add = function(el_name){
  var self = this;
  if(!self.impression_vm_obj){
    self.impression_vm_obj = new ImpressionMgr();

    var Impression_html_Template = _.template($('[data-template="impression_template"]').html());
    var impression_element = $(el_name);
    var impression_html_text = Impression_html_Template();
    impression_element.html(impression_html_text);
    self.impression_el = document.getElementById('impression_container');
    ko.applyBindings(self.impression_vm_obj , self.impression_el);
  }
}

Impression_wrapper.prototype.remove = function(el_name){
  
  var self = this;
  if(!self.impression_vm_obj){
    return;
  }
  ko.cleanNode(self.impression_el);
  var impression_element = $(el_name);
  impression_element.html(null);
  self.impression_vm_obj = null;
  self.impression_el = null;

}

Impression_wrapper.prototype.receive_message = function(message_obj){
  
  var self = this;
  if(!self.impression_vm_obj){
    return;
  }
  self.impression_vm_obj.receive_message(message_obj);
}



function ImpressionMgr(){
	var self = this;
  self.hearhear_users = ko.observableArray();
  self.booboo_users = ko.observableArray();

  self.remove_fadeout = function(elem){
    var self = this;
    $(elem).fadeOut();
  }
}

/*
　{type:chat:message:AAAAAAAAAAAAAAAAAAAAAaaa}
　{type:sound, message:{type:hearhear:user_id:AAAA}}
　{type:sound, message:{type:poi, user_id:BBBB}}
*/

ImpressionMgr.prototype.receive_message = function(message_obj){

  var self = this;

  var type = message_obj["type"];
  var user_parse_id = message_obj["user_id"];

  switch (type){
    case "poi":
      sound_mgr.play_sound_poi();
    break;
    case "hearhear":
      self.show_hearhear_user(user_parse_id);
    break;
    case "booboo":
      self.show_booboo_user(user_parse_id);
    break;
    case "taken":
      sound_mgr.play_sound_taken();
    break;
    case "poi_finish":
      sound_mgr.play_sound_poi_finish();
    break;
  }

}




ImpressionMgr.prototype.click_hearhear = function(){
  var self = this;

  var hearhear_message_obj = {type:"sound", message:{type:"hearhear",user_id:global_own_parse_id}};
  var hearhear_message_str = JSON.stringify(hearhear_message_obj);
  gapi.hangout.data.sendMessage(hearhear_message_str);

  self.show_hearhear_user(global_own_parse_id);

}


ImpressionMgr.prototype.click_booboo = function(){
	var self = this;

  var booboo_message_obj = {type:"sound", message:{type:"booboo",user_id:global_own_parse_id}};
  var booboo_message_str = JSON.stringify(booboo_message_obj);
  gapi.hangout.data.sendMessage(booboo_message_str);
  self.show_booboo_user(global_own_parse_id);

}



ImpressionMgr.prototype.show_hearhear_user = function(user_id){

	var self = this;
  var src = participant_mgr_obj.getPict_fromParseID(user_id);
  var unique_id = get_guid();
  var object = {id:unique_id, pict_src:src};
  self.hearhear_users.push(object);

  var timer; 
  timer = setTimeout(function(){self.remove_hearhear(object)},1000);
  sound_mgr.play_sound_heahear();
}

ImpressionMgr.prototype.show_booboo_user = function(user_id){
  var self = this;
  var src = participant_mgr_obj.getPict_fromParseID(user_id);
  var unique_id = get_guid();
  var object = {id:unique_id, pict_src:src};
  self.booboo_users.push(object);

  var timer; 
  timer = setTimeout(function(){self.remove_booboo(object)},1000);
  sound_mgr.play_sound_booboo();

}



ImpressionMgr.prototype.remove_hearhear = function(object){
  var self = this;
  self.hearhear_users.remove(object);
}

ImpressionMgr.prototype.remove_booboo = function(object){
  var self = this;
  self.booboo_users.remove(object);
}




