function get_parse_hangout_mapping_data_counter(){

  var counter_str = gapi.hangout.data.getValue("parse_hangout_mapping_counter");
  var counter = Number(counter_str);

  if(Number.isInteger(counter)){
    return counter;
  }
  return 0;


  return counter;
}

function get_parse_hangout_mapping_data(){

  var parse_hangout_mapping_str = gapi.hangout.data.getValue("parse_hangout_mapping");
  var parse_hangout_mapping_array;

  if(parse_hangout_mapping_str){
    parse_hangout_mapping_array = JSON.parse(parse_hangout_mapping_str);
  }else{
    parse_hangout_mapping_array = new Array();
  }
  console.log("parse_hangout_mapping" + parse_hangout_mapping_array)

  return parse_hangout_mapping_array;

}




function get_hangout_speech_status_counter(){

  var counter_str = gapi.hangout.data.getValue("hangout_speech_status_counter");
  var counter = Number(counter_str);
  if(Number.isInteger(counter)){
    return counter;
  }
  return 0;
}


function get_parse_data_counter(){
  var counter_str = gapi.hangout.data.getValue("parse_data_counter");
  var counter = Number(counter_str);
  if(Number.isInteger(counter)){
    return counter;
  }
  return 0;
}


function get_hangout_speech_status(){

  var hangout_speech_status_str = gapi.hangout.data.getValue("hangout_speech_status");
  var hangout_speech_status_obj;

  if(hangout_speech_status_str){
    hangout_speech_status_obj = JSON.parse(hangout_speech_status_str);
  }else{
    hangout_speech_status_obj = new Object();
    hangout_speech_status_obj["poi_speaker"] = null;
    hangout_speech_status_obj["speaker"] = null;
    hangout_speech_status_obj["poi_candidate"] = new Array();
  }

  return hangout_speech_status_obj;

}

function get_game_obj_counter(){

  var counter_str = gapi.hangout.data.getValue("game_obj_counter");
  var counter = Number(counter_str);

  return counter;
}

function  get_parse_data_changed_counter(){

    var counter_str = gapi.hangout.data.getValue("parse_data_changed_counter");
    var counter = Number(counter_str);

  return counter;
}

function get_transcription_counter(){

    var counter_str = gapi.hangout.data.getValue("transcription_counter");
    if(!counter_str){
      counter_str = "1";
    }
    var counter = Number(counter_str);

    if(counter > 99){
      counter = 1;
    }

  return counter;
}

function  get_speech_id(){

  var unique_speech_id = gapi.hangout.data.getValue("speech_id");

  return unique_speech_id;
}


function  get_current_speaker_role(){

  var current_speaker_role = gapi.hangout.data.getValue("current_speaker_role");
  return current_speaker_role;
}
function filter_with_existing_hangouID(in_speaker_obj){

  var participant_array = new Array();
  var enabled_participants_array = gapi.hangout.getEnabledParticipants();
  for(var i=0; i< enabled_participants_array.length; i++){
    if(enabled_participants_array[i].id == in_speaker_obj.hangout_id){
      return in_speaker_obj;
    }
  }
  return null;
}

function filter_array_with_existing_hangouID(in_hangoutid_array){

  var new_hangoutid_array = new Array();
  var enabled_participants_array = gapi.hangout.getEnabledParticipants();

  if(!in_hangoutid_array){
    return new_hangoutid_array;
  }


  for(var j=0; j<in_hangoutid_array.length; j++){
    for(var i=0; i< enabled_participants_array.length; i++){
      if(enabled_participants_array[i].id == in_hangoutid_array[j]){
        new_hangoutid_array.push(in_hangoutid_array[j]);
      }
    }
  }
  return new_hangoutid_array;
}


