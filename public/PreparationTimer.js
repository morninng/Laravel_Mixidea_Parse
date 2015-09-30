function PreparationTimer(){
	var self = this;
	self.timer = null;
}


PreparationTimer.prototype.show = function(){
	var self = this;
	self.timer_element = $("#preparation_time_value");
	if(!self.timer_element){
		return;
	}
	self.timer_element.html("start");
	self.count_timer_start();
}


PreparationTimer.prototype.hide = function(){
	var self = this;

	if(self.timer === null){
		return;
	}
	self.timer_element.html(null);
  clearInterval(self.timer);
  self.timer = null;

}


PreparationTimer.prototype.count_timer_start = function() {
	var self = this;
    clearInterval(self.timer);
  start_time = actual_game_obj.get("prep_start_time");
	self.timer = setInterval( function(){self.count_timer_show(start_time)}, 1000);
}

PreparationTimer.prototype.count_timer_show = function(start_time) {
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

	self.timer_element.html(elapsed_minute + ":" + elapled_second + " has passed");

}



