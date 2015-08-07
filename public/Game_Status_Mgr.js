function Game_Status_Mgr(){
	var self = this;
	// var self.timer;
	self.status = 0;
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


	self.prep_start_class = ko.observable("btn-primary");
	self.prep_finish_class = ko.observable("btn-primary");
	self.eval_start_class = ko.observable("btn-primary");
	self.game_complete_class = ko.observable("btn-primary");


}

Game_Status_Mgr.prototype.initialize = function(game_obj){
	var self = this;
	self.event_start_time;
	self.game_status = game_obj.game_status;


}


Game_Status_Mgr.prototype.click_PrepStart = function() {
	var self = this;
	console.log("preparation start")
	//start_timer();
	self.indicate_class_introduction("game_status_indicate_focusued");
	self.game_status_message("introduction: you can introduce each other with the participants");
}


Game_Status_Mgr.prototype.click_PrepFinish = function() {
	var self = this;
	console.log("prep finish");
	//Complete_timer();
	self.game_status_message("introduction: preparation finish starting debate");

}

Game_Status_Mgr.prototype.click_EvalStart = function() {
	var self = this;
	console.log("eval start");

}

Game_Status_Mgr.prototype.click_GameComplete = function() {
	var self = this;
	console.log("game complete");

}

/*
Game_Status_Mgr.prototype.update_status = function(status_num) {
	var self = this;

}

*/