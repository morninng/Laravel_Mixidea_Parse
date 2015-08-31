

function get_hangout_edit_status_counter(){

  var counter_str = gapi.hangout.data.getValue("edit_status_counter");
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

