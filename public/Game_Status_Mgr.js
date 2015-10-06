function Game_Status_Mgr(){
	var self = this;
	self.timer = null;
}

Game_Status_Mgr.prototype.initialize = function(){
	var self = this;
	self.$el_start_prep_container = $("#container_main_left_above_right");
	self.$el_start_debate_container = $("#container_main_left_above_right");
	self.$el_start_reflec_container = $("#top_right");
	self.handleEvents()

}
Game_Status_Mgr.prototype.handleEvents = function(){
	var self = this;
	self.$el_start_prep_container.on("click","#start_prep_button", function(e){self.click_PrepStart();});
	self.$el_start_debate_container.on("click","#start_debate_button", function(e){self.click_DebateStart();});
	self.$el_start_reflec_container.on("click","#start_reflec_button", function(e){self.click_ReflecStart();});
}



Game_Status_Mgr.prototype.click_PrepStart = function() {
	var self = this;
	console.log("preparation start")
	//start_timer();
	self.update_server_status("preparation");
}


Game_Status_Mgr.prototype.click_DebateStart = function() {
	var self = this;
	self.update_server_status("debate");

}

Game_Status_Mgr.prototype.click_ReflecStart = function() {
	var self = this;
	console.log("eval start");
	self.update_server_status("introduction");

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
		actual_game_obj.set("prep_start_time", prep_start_time);
	}

	actual_game_obj.set("game_status", str_status);
	actual_game_obj.save(null, {
	  success: function(obj) {
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
	  	console.log("fail update status");
	  }
	});
}




