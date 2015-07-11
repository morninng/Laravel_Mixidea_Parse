
function Set_Hangout_obj_inGameObj(game_obj){

  console.log("set hangout obj is called");

  var hangout_obj = new Object();
  game_type = game_obj.get("style");
  
  var HangoutIdList = Parse.Object.extend("HangoutIdList");
  var hangout_id_query = new Parse.Query(HangoutIdList);
  hangout_id_query.equalTo("used", false);
  var num_hangoutid = get_hangout_id_num( game_type );
  hangout_id_query.limit(num_hangoutid);

  hangout_id_query.find().then(function(results){
    if(results.length != num_hangoutid){
      return false;
    }
    set_hangoutobj_array_used(results);
    hangout_obj = set_each_object(results, game_type);
    game_obj.set("hangout_id",hangout_obj); 
    return game_obj.save();
    }).then(function(obj){
    	console.log("success");
    });
}

function set_hangoutobj_array_used(hangout_obj_array){

  for(var i=0; i< hangout_obj_array.length; i++){
    set_hangoutobj_used(hangout_obj_array[i]);
  }

}

function set_hangoutobj_used(hangout_obj){
  
  hangout_obj.set("used", true);
  hangout_obj.save(null, {
   success: function(obj) {
     console.log("success to save hangout obj")
   },
   error: function(obj, error) {
    console.log("fail to save hangout obj");
   }
  });
  
}


function set_each_object(hangout_id_array, game_type){

  var hangout_obj = new Object();

  switch (game_type){
    case "NorthAmerica": 
      if(hangout_id_array.length != 3){
      	return null;
      }
      hangout_obj["main"] = hangout_id_array[0].get("HangoutID");
      hangout_obj["Gov"] = hangout_id_array[1].get("HangoutID");
      hangout_obj["Opp"] = hangout_id_array[2].get("HangoutID");
     break;
    case "Asian":
      if(hangout_id_array.length != 3){
      	return null;
      }
      hangout_obj["main"] = hangout_id_array[0].get("HangoutID");
      hangout_obj["Prop"] = hangout_id_array[1].get("HangoutID");
      hangout_obj["Opp"] = hangout_id_array[2].get("HangoutID");
     break;
    case "BP":
      if(hangout_id_array.length != 5){
      	return null;
      }
      hangout_obj["main"] = hangout_id_array[0].get("HangoutID");
      hangout_obj["OG"] = hangout_id_array[1].get("HangoutID");
      hangout_obj["OO"] = hangout_id_array[2].get("HangoutID");
      hangout_obj["CG"] = hangout_id_array[3].get("HangoutID");
      hangout_obj["CO"] = hangout_id_array[4].get("HangoutID");
    
     break
   }
   
  return hangout_obj;
   
} 

function get_hangout_id_num(game_type){

  switch (game_type){
    case "NorthAmerica": 
      return 3;
     break;
    case "Asian":
      return 3;
     break;
    case "BP":
      return 5;
     break
  }
  return 0;
}
