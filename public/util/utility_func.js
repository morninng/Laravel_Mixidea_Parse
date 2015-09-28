

	
function add_linebreak_html(context){
	var converted_context = context.split("<").join("&lt;");
	converted_context = converted_context.split(">").join("&gt;");
	//改行を改行タグに置き換える
	converted_context = converted_context.split("\n").join("<br>");

	return converted_context;
}


function concatenate_json(obj_added, obj_add){

	for(key in obj_add){
	  obj_added[key] = obj_add[key]
	}
	return obj_added

}

function get_guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}
