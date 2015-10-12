var global_own_edit_status;
var global_own_edit_element;
var global_element_counter;


function DiscussNoteWrapper(){
  var self = this;
  
}

DiscussNoteWrapper.prototype.update_from_server = function(){

  var self = this;
  if(!self.discussion_note_obj){
    return;
  }
  self.discussion_note_obj.update_hangout_status();

}


DiscussNoteWrapper.prototype.removeAll = function(){
  var self = this;
  if(!self.discussion_note_obj){
    return;
  }
  self.discussion_note_obj.remove_all();
  self.discussion_element.html(null);
  self.discussion_note_obj = null;



}

DiscussNoteWrapper.prototype.CreateLayout_debating = function(el_name){

  var self = this;

  self.discussion_note_obj = new DiscussNoteMgr();

  var is_audience = participant_mgr_obj.isAudience_yourself();


  if(is_audience){
    link_name_list = participant_mgr_obj.get_all_debater_group_name_array();
    /*create discussion setting obj*/
    var comment_query_list = new Array();
    for(var i=0; i<link_name_list.length; i++){
      comment_query_list[i] = link_name_list[i]
    }
    comment_query_list.push("Aud");
    var Arg_setting_array = new Array();
    for(var i=0; i< link_name_list.length; i++){
      var obj = { 
          template:"argument_template",
          comment_query_array:comment_query_list,
          user_editable:false
        }
      obj["element"] = "#argument_pain" + link_name_list[i];
      obj["team_name"] = link_name_list[i];
      obj["element"] = "#argument_pain" + link_name_list[i];
      Arg_setting_array.push(obj);
    }
    discussion_note_setting = {Arg:Arg_setting_array};

    /*create template*/
    var tab_obj_array = new Array();
    for(var i=0; i< link_name_list.length; i++){

      var active = "";
      if(i==0){
        active = "active";
      }
      var tab_obj = {name:link_name_list[i],active_str:active};
      tab_obj_array.push(tab_obj);
    }
  //  var data = { team_list:tab_obj_array};

    template_name = "discussion_multiple_template";
    temp_name = "[data-template='" + template_name + "']";
    var DiscussTab_Template = _.template($(temp_name).html());
    self.discussion_element = $(el_name);
    var discussion_tab_html_text = DiscussTab_Template({list:tab_obj_array});
    self.discussion_element.html(discussion_tab_html_text);

  }else{
    var own_goup_name = participant_mgr_obj.get_own_group_name();
/*create discussion setting obj*/
    discussion_note_setting = {
    Arg:[
        {
          team_name:own_goup_name, 
          element:"#argument_pain",
          template:"argument_template",
          comment_query_array:[own_goup_name],
          user_editable:true
        }
      ]
    }

/*create template*/
    template_name = "discussion_single_template";
    var temp_name = "[data-template='" + template_name + "']";
    var discussion_Note_Template = _.template($(temp_name).html());
    self.discussion_element = $(el_name);
    var discussion_note_html_text = discussion_Note_Template();
    self.discussion_element.html(discussion_note_html_text);
  }



  self.discussion_note_obj.initialize(discussion_note_setting);


}


DiscussNoteWrapper.prototype.CreateLayout_reflection = function(el_name){

  var self = this;
  self.discussion_note_obj = new DiscussNoteMgr();

  var link_name_list = participant_mgr_obj.get_all_debater_group_name_array();
  var own_group_name = participant_mgr_obj.get_own_group_name()

  /*create discussion setting obj*/
  var comment_query_list = new Array();
  for(var i=0; i<link_name_list.length; i++){
    comment_query_list[i] = link_name_list[i]
  }
  comment_query_list.push("Aud");
  var Arg_setting_array = new Array();
  for(var i=0; i< link_name_list.length; i++){
    var obj = { 
        template:"argument_template",
        comment_query_array:comment_query_list,
        user_editable:false
      }
    var editable = false;
    if(own_group_name == link_name_list[i]){
      editable = true;
    }
    obj["user_editable"] = editable;
    obj["element"] = "#argument_pain" + link_name_list[i];
    obj["team_name"] = link_name_list[i];
    obj["element"] = "#argument_pain" + link_name_list[i];
    Arg_setting_array.push(obj);
  }
  discussion_note_setting = {Arg:Arg_setting_array};
  /*create template*/
  var tab_obj_array = new Array();
  for(var i=0; i< link_name_list.length; i++){

    var active = "";
    /*
    if(i==0){
      active = "active";
    }
    */
    var tab_obj = {name:link_name_list[i],active_str:active};
    tab_obj_array.push(tab_obj);
  }

  var summary_tab_name = "PostGameOpinion";
  var summary_tab_obj = {name:summary_tab_name, active_str:"active"};
  tab_obj_array.push(summary_tab_obj);

  template_name = "discussion_multiple_template";
  temp_name = "[data-template='" + template_name + "']";
  var DiscussTab_Template = _.template($(temp_name).html());
  self.discussion_element = $(el_name);
  var discussion_tab_html_text = DiscussTab_Template({list:tab_obj_array});
  self.discussion_element.html(discussion_tab_html_text);


  self.discussion_note_obj.initialize(discussion_note_setting);

}



 

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

DiscussNoteMgr.prototype.remove_all = function(){

  var self = this;

  for(var i=0; i<self.arg_array.length; i++){
    var team_name = self.arg_array[i].team_name;
    var obj_name = "argument_mgr_obj_" + team_name;
    if(self[obj_name]){
      self[obj_name].remove_all();
      self[obj_name] = null;
    }
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
      if(updated_element_counter_str){
        var updated_element_counter_json = JSON.parse(updated_element_counter_str);
        updated_element_counter_all = concatenate_json(updated_element_counter_all, updated_element_counter_json);
      }
    }
  }
  if(self.concept_array){
    for(var i=0; i<self.concept_array.length; i++){
      var team_name = self.arg_array[i].team_name;
      var element_counter_key =  "element_counter" + team_name;
      var updated_element_counter_str = gapi.hangout.data.getValue(element_counter_key);
      if(updated_element_counter_str){
       var updated_element_counter_json = JSON.parse(updated_element_counter_str);
       updated_element_counter_all = concatenate_json(updated_element_counter_all, updated_element_counter_json);
      }
    }
  }
//



  var element_updated = new Array();
  var element_added = new Array();



  for( updated_key  in updated_element_counter_all ){
    var exist = false;
    var counter_update = false;
    for( existing_key in global_element_counter){

      if(existing_key == updated_key){
        exist = true;
        if(updated_element_counter_all[updated_key].count != global_element_counter[existing_key].count){
          counter_update = true;
          element_updated.push(updated_element_counter_all[updated_key]);
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

