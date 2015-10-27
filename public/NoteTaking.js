

function NoteTakingTabWrapper(){
	var self = this;
	self.summary_tab_obj = null;

}
 
NoteTakingTabWrapper.prototype.update_speaker = function(){

	var self = this;
	if(!self.role_array){
		return;
	}

	$('.note_take_container' ).css('background-color','');
	var role_name =	video_view_wrapper.get_current_speaker_role();
	if(role_name){
		$('#' + role_name + '_note_taking').css('background-color', '#FFFACD');
	}

}

NoteTakingTabWrapper.prototype.createDom = function(root_element_name){

	var self = this;
	var game_style = actual_game_obj.get("style");

	switch(game_style){
	  case 'NorthAmerica':
			self.role_array = ["PrimeMinister","LeaderOpposition","MemberGovernment","MemberOpposition","ReplyPM","LOReply"];
		break;
	  case 'Asian':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition",
                      "GovernmentWhip","OppositionWhip","GovermentReply","OppositionReply"];
		break;
	  case 'BP':
	  	self.role_array = ["PrimeMinister","LeaderOpposition","DeptyPrimeMinister","DeptyLeaderOpposition","MemberGovernment","MemberOpposition","GovernmentWhip","OppositionWhip"];
		break;
	}

  self.root_element = $(root_element_name);

	var dom = $("<div>");
	dom.attr("id","note_take_container");

  for(var i=0; i< self.role_array.length; i++){
  	
	  var own_role = participant_mgr_obj.is_OwnRole(self.role_array[i]);
	  var title_message_content = null;
	  if(own_role){
	  	title_message_content = "<span class='own_memo_style'>Your speech memo </span> as " + self.role_array[i]; 
	  }else{
	  	title_message_content =  self.role_array[i] + " speech"; 
	  }
	  var data_obj = {role_name: self.role_array[i], title_message:title_message_content}

	  var html_Template = _.template($('[data-template="note_content_template"]').html());
	  var html_text = html_Template(data_obj);
	  dom.append(html_text);
	}
	self.root_element.html(dom);


  for(var i=0; i< self.role_array.length; i++){
  	eval("self.note_take_obj_" + self.role_array[i] + "= new NoteTaking('" + self.role_array[i] +"');");
  	var temp_note_take_obj = eval("self.note_take_obj_" + self.role_array[i]);
	  eval("self.note_take_el_" + self.role_array[i] + "= document.getElementById('" + self.role_array[i] +"_note_taking')");
	  var temp_note_take_el = eval("self.note_take_el_" + self.role_array[i]);
	  ko.applyBindings(temp_note_take_obj, temp_note_take_el );
	}
	self.retrieveData_apply();
	self.retrieveScore_apply()
}


NoteTakingTabWrapper.prototype.remove = function(){
	var self = this;

	if(!self.role_array){
		return;
	}

	for(var i=0; i< self.role_array.length; i++){
		var temp_note_take_el = eval("self.note_take_el_" + self.role_array[i]);
  	ko.cleanNode(temp_note_take_el);
		eval("self.note_take_el_" + self.role_array[i] + " = null");
  	eval("self.note_take_obj_" + self.role_array[i] + " = null");
  	temp_note_take_obj = null;
	}
	self.root_element.html(null);
	self.role_array = null;
}


NoteTakingTabWrapper.prototype.retrieveData_apply = function(){
	var self = this;

	var NoteTaking = Parse.Object.extend("NoteTaking");
	var note_query = new Parse.Query(NoteTaking);
	note_query.equalTo("game_id", global_debate_game_id);
	note_query.equalTo("author_id", global_own_parse_id);
	note_query.find({
	  success: function(results) {


	  	for(var i=0; i< self.role_array.length; i++){
	  		var note_context_array = new Array();

		    for (var j = 0; j < results.length; j++) {
		      var object = results[j];
		      var role_name = object.get("role_name");
		      if(role_name == self.role_array[i]){
		      	note_context_array.push(object);
		      }
		    }
		    if(note_context_array.length > 0){
		    	var temp_note_take_obj = eval("self.note_take_obj_" + self.role_array[i]);
		    	temp_note_take_obj.show_context_all(note_context_array);
		    }
		  }
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});

}


NoteTakingTabWrapper.prototype.retrieveScore_apply = function(){

	var self = this;

	var Score = Parse.Object.extend("Score");
	var score_query = new Parse.Query("Score");
	score_query.equalTo("game_id", global_debate_game_id);
	score_query.equalTo("scorer_id", global_own_parse_id);
	score_query.find({
	  success: function(results) {

	  	for(var i=0; i< self.role_array.length; i++){
	  		var note_context_array = new Array();

		    for (var j = 0; j < results.length; j++) {
		      var object = results[j];
		      var role_name = object.get("role_name");
		      if(role_name == self.role_array[i]){
			    	var temp_note_take_obj = eval("self.note_take_obj_" + self.role_array[i]);
			    	temp_note_take_obj.score_apply(object);
		      }
		    }
		  }
	 },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function NoteTaking(role_name){
	var self = this;
	self.role_name = role_name;
	self.note_content_list = ko.observableArray();
  self.opinion_type_input = ko.observable("note");
  self.input_data = ko.observable();
  self.visible_radio_selection = ko.observable(true);
  self.score_value= ko.observable("75");
  self.score_obj_id = null;

  self.score = ko.observable("75");
  self.score_message = ko.observable("average");
  self.visible_score_message = ko.observable(false);

  self.speaker_parse_id = participant_mgr_obj.getParseID_fromRole(role_name)

  self.click_edit_note = function(data){

  	for(var i=0; i< self.note_content_list().length; i++){
  		if(data.id == self.note_content_list()[i].id){
  			var obj = {
					id:data.id,
					visible_context:false,
					note_title:data.note_title,
					style_note_context:data.style_note_context,
					note_content:data.note_content,
					visible_note_edit_button:false,

					visible_edit_context:true,
					opinion_type_edit:data.opinion_type_edit,
					input_edit_data:data.input_edit_data,
					visible_note_save_button:true,
					visible_radio_selection:data.visible_radio_selection
  			}
  			self.note_content_list.splice(i,1,obj);
  		}
  	}
  }
  self.click_edit_cancel = function(data){
  	for(var i=0; i< self.note_content_list().length; i++){
  		if(data.id == self.note_content_list()[i].id){
  			var obj = {
					id:data.id,
					visible_context:true,
					note_title:data.note_title,
					style_note_context:data.style_note_context,
					note_content:data.note_content,
					visible_note_edit_button:true,

					visible_edit_context:false,
					opinion_type_edit:data.opinion_type_edit,
					input_edit_data:data.backup_text_content,
					visible_note_save_button:false,
					visible_radio_selection:data.visible_radio_selection
  			}
  			self.note_content_list.splice(i,1,obj);
  		}
  	}

  }
  self.click_remove_note = function(data){
  	self.note_content_list.remove(
  		function(item){
  			return item.id == data.id;
  		});


		var NoteTaking = Parse.Object.extend("NoteTaking");
		var note_query = new Parse.Query(NoteTaking);
		note_query.get(data.id,{
		  success: function(result) {
		  	result.destroy({
				  success: function(obj) {
				  },
				  error: function(obj, error) {
				  }
				});
		  },
		  error: function(obj,error){

		  }
		});
  }


  self.click_edit_update = function(data){
		console.log("edit save");

		var updated_text = data.input_edit_data;
		var converted_updated_text = add_linebreak_html(updated_text);

		console.log(data.input_edit_data);


		var NoteTaking = Parse.Object.extend("NoteTaking");
		var note_query = new Parse.Query(NoteTaking);
		note_query.get(data.id,{
		  success: function(result) {
		  	result.set("context",updated_text);
		  	result.save().then(
		  		function(){

				  	for(var i=0; i< self.note_content_list().length; i++){
				  		if(data.id == self.note_content_list()[i].id){
				  			var obj = {
									id:data.id,
									visible_context:true,
									note_title:data.note_title,
									style_note_context:data.style_note_context,
									note_content:converted_updated_text,
									visible_note_edit_button:true,

									visible_edit_context:false,
									opinion_type_edit:data.opinion_type_edit,
									input_edit_data:updated_text,
									visible_note_save_button:false,
									visible_radio_selection:data.visible_radio_selection,
									backup_text_content:updated_text
				  			}
				  			self.note_content_list.splice(i,1,obj);
				  		}
				  	}

		  		},function(error){

		  		}
		  	);
		  },
		  error: function(obj,error){

		  }
		});


  }
}


NoteTaking.prototype.show_context_all = function(context_array){
	var self = this;

	for(var i=0; i<context_array.length; i++ ){
		self.show_context(context_array[i]);
	}
}

NoteTaking.prototype.show_context = function(context){
	var self = this;

	var text_content = context.get("context");
	var converted_text_content = add_linebreak_html(text_content);
	var opinion_type = context.get("type");
	var opinion_title_message = null;
	var style = null;
	switch(opinion_type){
		case "note":
			opinion_title_message = "speech note";
			style = "note_box";
		break;
		case "evaluation":
			opinion_title_message = "evaluation comment to speaker";
			style = "evaluation_box";
		break;
		case "refute":
			opinion_title_message = "refute idea";
			style = "refute_box";
		break;
	}
	note_obj_id = context.id;
	var content_obj = {
		id:note_obj_id,
		visible_context:true,
		note_title:opinion_title_message,
		style_note_context:style,
		note_content:converted_text_content,
		visible_note_edit_button:true,

		visible_edit_context:false,
		opinion_type_edit:opinion_type,
		input_edit_data:text_content,
		visible_note_save_button:false,
		visible_radio_selection:true,
		backup_text_content: text_content
	}
	self.note_content_list.push(content_obj);



}

NoteTaking.prototype.click_add_note = function(){
	var self = this;

	var in_text_content = self.input_data();
	var in_opinion_type = self.opinion_type_input();
	var opinion_title_message = null;
	var style = null;
	switch(in_opinion_type){
		case "note":
			opinion_title_message = "speech note";
			style = "note_box";
		break;
		case "evaluation":
			opinion_title_message = "evaluation comment to speaker";
			style = "evaluation_box";
		break;
		case "refute":
			opinion_title_message = "refute idea";
			style = "refute_box";
		break;
	}
	var NoteTaking = Parse.Object.extend("NoteTaking");
	var note_take_obj = new NoteTaking();
	note_take_obj.set("game_id", global_debate_game_id);
	note_take_obj.set("author_id", global_own_parse_id);
	note_take_obj.set("speaker_id", self.speaker_parse_id);
	note_take_obj.set("role_name", self.role_name);
	note_take_obj.set("context", in_text_content);
	note_take_obj.set("type", in_opinion_type);

	note_take_obj.save(null, {
	  success: function(obj) {
	  	self.show_context(obj);
	  	self.input_data(null);
	  },
	  error: function(obj, error) {
	    alert('Failed to save data, try saving again');
	  }
	});
}


NoteTaking.prototype.score_apply = function(score_obj){
	var self = this;
	self.score_obj_id = score_obj.id;
	var score = score_obj.get("score");
	console.log(score);
	self.score_value(score);
	self.score(score);
	var message = self.get_message(score);
	self.score_message(message);
	self.visible_score_message(true);
}

NoteTaking.prototype.score_input = function(){
	var self = this;
	var score = self.score_value();
	console.log(score);
	self.score(score);
	var message = self.get_message(score);
	self.score_message(message);
	self.visible_score_message(true);

	if(self.score_obj_id){


		var Score = Parse.Object.extend("Score");
		var score_query = new Parse.Query(Score);
		score_query.get(self.score_obj_id,{
		  success: function(result) {
		  	result.set("score",score);
		  	result.save(null, {
				  success: function(score_obj) {
				   console.log("score is saved" + score);
				  },
				  error: function(score_obj, error) {
				   alert("saving score failed, please slide and save again"); 
				  }
				});
		  },
		  error: function(score_obj, error) {
				   alert("finding score object failed"); 
			}
		});
	}else{

		var Score = Parse.Object.extend("Score");
		var score_obj = new Score();
		score_obj.set("game_id", global_debate_game_id);
		score_obj.set("scorer_id", global_own_parse_id);
		score_obj.set("player_id", "AAAA");
		score_obj.set("role_name", self.role_name);
		score_obj.set("score", score);
		score_obj.save(null, {
		  success: function(score_obj) {
		  	console.log("score is saved" + score);
				self.score_obj_id = score_obj.id
		  },
		  error: function(score_obj, error) {
		   alert("saving score failed, please slide and save again"); 
		  }
		});
	}

}



NoteTaking.prototype.get_message  = function(score_str){

  var message="";
  score = Number(score_str)
  if(score > 94.5){
    message="Plausibly best debating";
  }else if (score > 89.5){
    message="Brilliant arguments are extremely well-explained";
  }else if (score > 84.5){
    message="highly compelling and analysed deeply";
  }else if (score > 79.5){
    message="good degree of explanation and analysis";
  }else if (score > 74.5){
    message="frequently persuasive";
  }else if (score > 69.5){
    message="generally relevant and some explanation of them given";
  }else if (score > 64.5){
    message="Relevant arguments with limited explanation";
  }else if (score > 59.5){
    message="often relevant, but rarely sustained arguments";
  }else if (score > 54.5){
    message="rarely relevant claims occasionally formulated as arguments";
  }else if (score < 55){
    message="never relevant and confused";
  }
  return message;
}

function add_linebreak_html(context){
	if(!context){
		return null;
	}
	var converted_context = context.split("<").join("&lt;");
	converted_context = converted_context.split(">").join("&gt;");
	//改行を改行タグに置き換える
	converted_context = converted_context.split("\n").join("<br>");

	return converted_context;
}