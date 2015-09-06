function Game_Status_Mgr(){
	var self = this;
	// var self.timer;
	self.status = 0;
	self.timer = null;
	self.game_status_message = ko.observable("-");
	self.preparation_time = ko.observable();
	self.indicate_class_introduction = ko.observable("game_status_indicate");
	self.indicate_class_preparation = ko.observable("game_status_indicate");
	self.indicate_class_debate = ko.observable("game_status_indicate");
	self.indicate_class_evaluation = ko.observable("game_status_indicate");


	self.prep_start_enabled = ko.observable(true);
	self.prep_finish_enabled = ko.observable(false);
	self.evaluation_start_enabled = ko.observable(true);
	self.game_complete_enabled = ko.observable(true);


	self.prep_start_class = ko.observable();
	self.prep_finish_class = ko.observable();
	self.eval_start_class = ko.observable();
	self.game_complete_class = ko.observable();


}

Game_Status_Mgr.prototype.initialize = function(){
	var self = this;


	var status_num = appmgr.actual_game_obj.get("game_status");
	if(!status_num){
	    status_num = "introduction";
	}
}


Game_Status_Mgr.prototype.click_PrepStart = function() {
	var self = this;
	console.log("preparation start")
	//start_timer();
	self.update_server_status("preparation");
}


Game_Status_Mgr.prototype.click_PrepFinish = function() {
	var self = this;
	console.log("prep finish");
	self.update_server_status("debate");

}

Game_Status_Mgr.prototype.click_EvalStart = function() {
	var self = this;
	console.log("eval start");
	self.update_server_status("evaluation");

}

Game_Status_Mgr.prototype.click_GameComplete = function() {
	var self = this;
	console.log("game complete");
	self.update_server_status("complete");

}


Game_Status_Mgr.prototype.update_server_status = function(str_status) {
	var self = this;

	if(str_status == "preparation"){
		var prep_start_time = new Date();
		appmgr.actual_game_obj.set("prep_start_time", prep_start_time);
	}

	appmgr.actual_game_obj.set("game_status", str_status);
	appmgr.actual_game_obj.save(null, {
	  success: function(obj) {
	  	/*
	  	var counter = get_game_status_counter();
	  	counter++;
	  	var counter_str = String(counter);
		gapi.hangout.data.submitDelta({
		   "game_status_counter":counter_str
		});*/

		var parse_data_counter = get_parse_data_changed_counter();
		if(!parse_data_counter){
			parse_data_counter = 0;
		}
		parse_data_counter++;
		parse_data_counter_str = String(parse_data_counter);
	    gapi.hangout.data.submitDelta({
		        "parse_data_changed_counter":parse_data_counter_str
		});




	  },
	  error: function(obj, error) {

	  }
	});
}



Game_Status_Mgr.prototype.apply_updated_status = function() {
	var self = this;

	var status_num = appmgr.actual_game_obj.get("game_status");
	self.apply_status(status_num);
}



Game_Status_Mgr.prototype.apply_status = function(status_num) {
	var self = this;

	self.reflesh_status();

	switch(status_num){
		case "introduction":

		self.game_status_message("introduction: you can introduce each other with the participants");
		self.indicate_class_introduction("game_status_indicate_focusued");
		self.count_timer_hide();
		appmgr.chat_view_model.unvisible_hangout_button();

		break;
		case "preparation":
		self.indicate_class_preparation("game_status_indicate_focusued");
		self.game_status_message("under preparation");
		var start_time = appmgr.actual_game_obj.get("prep_start_time");
		console.log(start_time);
		self.count_timer_start(start_time);
		appmgr.chat_view_model.visible_hangout_button();

		break;
		case "debate":
		self.indicate_class_debate("game_status_indicate_focusued");
		self.game_status_message("time to debate");
		self.count_timer_hide();
		appmgr.chat_view_model.unvisible_hangout_button();

		break;
		case "evaluation":
		self.indicate_class_evaluation("game_status_indicate_focusued");
		self.game_status_message("make a comment and discuss each other");
		self.count_timer_hide();
		appmgr.chat_view_model.unvisible_hangout_button();

		break;
		case "complete":
		appmgr.chat_view_model.unvisible_hangout_button();

		break;

	}
}


Game_Status_Mgr.prototype.count_timer_start = function(start_time) {
	var self = this;
    clearInterval(self.timer);
	self.timer = setInterval( function(){self.count_timer_show(start_time)}, 1000);
}

Game_Status_Mgr.prototype.count_timer_show = function(start_time) {
	var self = this;
	var current_time = new Date();
	var elapsed_time = current_time - start_time;
	var elapled_second = elapsed_time/1000
	var elapsed_hour = elapled_second/60/60;
	elapsed_hour = Math.floor(elapsed_hour);
	var elapsed_minute = (elapled_second - elapsed_hour*60*60)/60;
	elapsed_minute = Math.floor(elapsed_minute);

	elapled_second = elapled_second - elapsed_hour*60*60 - elapsed_minute*60;
	elapled_second = Math.floor(elapled_second);

	elapled_second = ("0" + elapled_second).slice(-2);
	elapsed_minute = ("0" + elapsed_minute).slice(-2);

	self.preparation_time(elapsed_minute + ":" + elapled_second + " has passed");


}

Game_Status_Mgr.prototype.count_timer_hide = function() {

	var self = this;
	self.preparation_time(null);
    clearInterval(self.timer);

}

Game_Status_Mgr.prototype.reflesh_status = function() {
	var self = this;
	self.indicate_class_introduction("game_status_indicate");
	self.indicate_class_preparation("game_status_indicate");
	self.indicate_class_debate("game_status_indicate");
	self.indicate_class_evaluation("game_status_indicate");

	self.prep_start_class();
	self.prep_finish_class();
	self.eval_start_class();
	self.game_complete_class();

}


