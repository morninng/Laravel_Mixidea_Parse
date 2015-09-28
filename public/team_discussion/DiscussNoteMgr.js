var global_own_edit_status;
var global_own_edit_element;
var global_element_counter;

function DiscussNoteMgr() {

  var self = this;
  global_own_edit_status = "default";
  global_own_edit_element = null;
  global_element_counter = new Object();
}


DiscussNoteMgr.prototype.initialize = function(setting){

  var self = this;

  self.arg_array = setting["Arg"];
  self.concept_array = setting["Concept"];

  for(var i=0; i<self.arg_array.length; i++){
    var team_name = self.arg_array[i].team_name;
    var obj_name = "argument_mgr_obj_" + team_name;
    self[obj_name] = new Argument_Mgr(self.arg_array[i]);
    self[obj_name].initialize();
  }
}


DiscussNoteMgr.prototype.update_hangout_status = function(){
  var self = this;
  self.retrieve_updated_element();
  self.update_edit_status();
}


DiscussNoteMgr.prototype.update_edit_status = function(){

  var self = this;

  if(!self.arg_array){
    return;
  }


  var edit_status_counter = get_hangout_edit_status_counter();

  if(self.edit_status_counter != edit_status_counter){
    for(var i=0; i<self.arg_array.length; i++){
      var team_name = self.arg_array[i].team_name;
      var obj_name = "argument_mgr_obj_" + team_name;
      self[obj_name].update_edit_status();
    //self.general_concept_mgr.update_edit_status();
    }
  }
}

/*
ここに、updated_by_team:aud  team_name: Gov を追加。
updated_by_teamにより、データ取得の対象になるかどうかを判断し、
team_nameにより、適切なオブジェクトにデータ取得をさせるように通知するかの判断に用いる。
*/
/*  data to be exchanged by hangout status 
  parseID_AAA_main:{type:"arg_main", count:"33"},
  parseID_BBB_main:{type:"arg_main", count:"34"},
  parseID_CCC_comment:{type:"comment",parent:"main_parseID_AAA" , count:"44"},
  parseID_DDD_comment:{type:"comment",parent:"main_parseID_AAA" , count:"45"},
  parseID_EEE_title:{type:"title", count:"56"}

*/

/*  data to be exchanged by hangout status   
  parseID_AAA_main:{type:"arg_main", count:"33",team_name:"Gov" },
  parseID_BBB_main:{type:"arg_main", count:"34",team_name:"Gov" },
  parseID_CCC_comment:{type:"comment",parent:"main_parseID_AAA" , count:"44",team_name:"Gov"},
  parseID_DDD_comment:{type:"comment",parent:"main_parseID_AAA" , count:"45",team_name:"Gov"},
  parseID_EEE_title:{type:"title", count:"56"}

　チームにひもづくArgumentは一辺にアップデートされるため、
　　ParseIDが異なる二つのArgumentが一辺に変更されることがあるが
　サーバからのデータ取得は一回でよい。
　　
　チームが違うものがであったら、Argumentはアップデートしなければいけない
　つまり、Gov_Main, Opp_Main, の二種類でアップデートしたものを記憶し、
　　element_to_be_updateに、アップデートされていないものがあったらアップデート

 Mainは誰がアップデートしたかに関わらずアップデート
　　commentもアップデートはする。表示側で制御
　　　→commentに関しては本来、別チームの人がアップデートしたときには
　　　更新しなくていいのだが、上記のデータ構造より、アップデートするべきものと
　　　アップデートしないでよいものが両方一辺に更新されたときに混ざって判別不能になる。

*/


DiscussNoteMgr.prototype.retrieve_updated_element = function(){

  var self = this;
  var updated_element_counter_all = new Object()

  if(self.arg_array){
    for(var i=0; i<self.arg_array.length; i++){
      var team_name = self.arg_array[i].team_name;
      var element_counter_key =  "element_counter" + team_name;
      var updated_element_counter_str = gapi.hangout.data.getValue(element_counter_key);
      var updated_element_counter_json = JSON.parse(updated_element_counter_str);
      updated_element_counter_all = concatenate_json(updated_element_counter_all, updated_element_counter_json);
    }
  }
  if(self.concept_array){
    for(var i=0; i<self.concept_array.length; i++){
      var team_name = self.arg_array[i].team_name;
      var element_counter_key =  "element_counter" + team_name;
      var updated_element_counter_str = gapi.hangout.data.getValue(element_counter_key);
      var updated_element_counter_json = JSON.parse(updated_element_counter_str);
      updated_element_counter_all = concatenate_json(updated_element_counter_all, updated_element_counter_json);
    }
  }
//


  console.log("counter json shared by hangout status");
  console.log(updated_element_counter_all);

  var element_updated = new Array();
  var element_added = new Array();

  console.log("element counter stored as a object is ")
  console.log(global_element_counter);


  for( updated_key  in updated_element_counter_all ){
    var exist = false;
    var counter_update = false;
    for( existing_key in global_element_counter){

      if(existing_key == updated_key){
        exist = true;
        if(updated_element_counter_all[updated_key].count != global_element_counter[existing_key].count){
          counter_update = true;
          element_updated.push(updated_element_counter_all[updated_key]);
          console.log("previous counter is" +  global_element_counter[existing_key].count);
          console.log("next counter is" + updated_element_counter_all[updated_key].count);
        }
      }
    }
    if(!exist){
      element_added.push(updated_element_counter_all[updated_key])
    }
  }

  var element_to_be_update = element_added.concat(element_updated);
  var arg_updated = false;
  var comment_updated_id_array = new Array();
  var already_updated_arg = new Array();
  var already_updated_comment = new Array()

  for(var i=0; i<element_to_be_update.length; i++ ){
    if( (element_to_be_update[i].type == "main" || element_to_be_update[i].type == "title") && !arg_updated){
      var team_name =element_to_be_update[i].team_name;
      if( already_updated_arg.indexOf(team_name) == -1){
        var obj_name = "argument_mgr_obj_" + team_name;
        self[obj_name].update_argument_from_server();
        already_updated_arg.push(team_name);
      }
    }

    if( element_to_be_update[i].type == "concept"){
      self.general_concept_mgr.update();
    }
    if( element_to_be_update[i].type == "comment"){
      var comment_updated = false;
      for(var j=0; j<comment_updated_id_array.length; j++){
        if(comment_updated_id_array[j].parent == element_to_be_update[i].parent){
          comment_updated = true;
        }
      }
      if(!comment_updated){
        var team_name =element_to_be_update[i].team_name;
        var parent_argument_id = element_to_be_update[i].parent;
        if( already_updated_comment.indexOf(parent_argument_id) == -1){
          var obj_name = "argument_mgr_obj_" + team_name;
          self[obj_name].update_comment_data_from_server(parent_argument_id);
          already_updated_comment.push(parent_argument_id);
        }
      }
    }
  }
}
/*
edit status object
  user_parse_id_1: {id:arg_idBBB_title,taem:"Gov", hangout_id:EditorHangoutID_AAAA }
  user_parse_id_2: {id:arg_idBBB_main,taem:"Opp", hangout_id:EditorHangoutID_BBB}

self.arg_id, "title" "main"

*/

