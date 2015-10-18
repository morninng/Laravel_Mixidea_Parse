

function get_hangout_discuss_note_edit_counter(){

  var counter_str = gapi.hangout.data.getValue("edit_status_counter");
  var counter = Number(counter_str);
  if(Number.isInteger(counter)){
    return counter;
  }
  return 0;
}


 function get_hangout_discuss_note_content_counter(){

  var counter_str = gapi.hangout.data.getValue("content_counter");
  var counter = Number(counter_str);
  if(Number.isInteger(counter)){
    return counter;
  }
  return 0;
}

function is_hangout_exist(in_hangout_id){


  var enabled_participants_array = gapi.hangout.getEnabledParticipants();
  for(var i=0; i< enabled_participants_array.length; i++){
    if(enabled_participants_array[i].id == in_hangout_id){
    	return true;
    }
  }

  return false;

}

// title, comment main information related to argument is updated, the counter is sent

//arg_id is set only when it is comment else, null is set

function util_send_argument_counter(obj, obj_type, in_team_name, arg_id){

  var parse_id = obj.id;
  var new_Counter = obj.get( obj_type + "_count");
  var new_counter_obj = new Object();
  var counter_obj = null;
  if(obj_type == "comment"){
    counter_obj = {type:obj_type, count:new_Counter, parent:arg_id, team_name:in_team_name};
  }else{
    counter_obj = {type:obj_type, count:new_Counter, team_name:in_team_name}; 
  }
  var element_counter_key =  "element_counter" + in_team_name;
  var original_counter_obj = gapi.hangout.data.getValue(element_counter_key);
  if(original_counter_obj){
    new_counter_obj = JSON.parse(original_counter_obj);
  }else{
    new_counter_obj = new Object();
  }
  new_counter_obj[parse_id + "_" + obj_type] = counter_obj;
  var new_counter_obj_str = JSON.stringify(new_counter_obj);



  var content_counter = get_hangout_discuss_note_content_counter();
  content_counter++;
  var content_counter_str = String(content_counter);

  var new_content_obj = new Object();
  new_content_obj[element_counter_key] = new_counter_obj_str;
  new_content_obj["content_counter"] = content_counter_str;

  gapi.hangout.data.submitDelta(new_content_obj);

}


function util_add_edit_status(in_id){


  var own_team_side = participant_mgr_obj.get_own_group_name();

  var user_obj = {id:in_id,taem:own_team_side, hangout_id:global_own_hangout_id };
  console.log(user_obj);
  var new_edit_status_obj = new Object();
  var current_edit_status_obj = gapi.hangout.data.getValue("edit_status");
  if(current_edit_status_obj){
      new_edit_status_obj = JSON.parse(current_edit_status_obj);
  }
  new_edit_status_obj[global_own_parse_id] = user_obj;
  var new_edit_status_obj_str = JSON.stringify(new_edit_status_obj);
  var edit_status_counter = get_hangout_discuss_note_edit_counter();
  edit_status_counter++;
  edit_status_counter_str = String(edit_status_counter);
  gapi.hangout.data.submitDelta({
    "edit_status":new_edit_status_obj_str,
    "edit_status_counter":edit_status_counter_str
  });
}


function util_remove_edit_status(){

    var new_edit_status_obj = new Object();
    var current_edit_status_obj = gapi.hangout.data.getValue("edit_status");
    if(current_edit_status_obj){
        new_edit_status_obj = JSON.parse(current_edit_status_obj);
    }
    delete new_edit_status_obj[global_own_parse_id];
    var new_edit_status_obj_str = JSON.stringify(new_edit_status_obj);
    var edit_status_counter = get_hangout_discuss_note_edit_counter();
    edit_status_counter++;
    edit_status_counter_str = String(edit_status_counter);

    var hangout_edit_status = new Object();
    hangout_edit_status["edit_status"] = new_edit_status_obj_str;
    hangout_edit_status["edit_status_counter"] = edit_status_counter_str;

    gapi.hangout.data.submitDelta( hangout_edit_status);

}