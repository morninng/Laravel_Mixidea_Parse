
function user_status_VM(role_name){
  var self = this;
  self.role_name = role_name;
  self.role = ko.observable();
  self.user_name = ko.observable("no applicant");
  self.pict_src = ko.observable("https://mixidea.parseapp.com/picture/1.jpg");
  self.user_status_css = ko.observable("notapplicant");
  self.parse_id_of_this_role = ko.observable(null);
  self.loading_visible = ko.observable(false);

  self.own_parse_id = appmgr.own_parse_id;
  self.game_id = appmgr.game_id;

  self.decline_visible = ko.observable(false);
  self.join_visible = ko.observable(false);
  self.cancel_visible = ko.observable(false);
  
  self.participant_visible = ko.observable(true);
}

user_status_VM.prototype.update_user_status = function(){

	var self = this;
	self.update_user_info(self.role_name);
	self.update_user_login_status(self.role_name);
	self.update_button_byGamestatus();
	self.update_button_status(self.role_name);
  	self.loading_visible = ko.observable(false);

}

user_status_VM.prototype.update_user_info = function(role_name){
	var self = this;

	var isAudience = appmgr.participant_manager_object.is_Audience(role_name);
	if(!isAudience){
		var show_role_name = self.convert_role_name(role_name);
		self.role(show_role_name);
	}

	var parse_id_of_this_role = appmgr.participant_manager_object.getParseID_fromRole(role_name);
	self.parse_id_of_this_role(parse_id_of_this_role);
	if(parse_id_of_this_role == null){
		self.user_name("no applicant");
		self.pict_src("https://mixidea.parseapp.com/picture/1.jpg");
		return ;
	}

	var name = appmgr.participant_manager_object.getUserFirstName(role_name);
	var pict_src = appmgr.participant_manager_object.getUserPictureSrc(role_name);
	self.user_name(name);
	self.pict_src(pict_src);
}

user_status_VM.prototype.update_user_login_status = function(role_name){

	var self = this;
	var login_status = appmgr.participant_manager_object.getLoginStatus(role_name);
	switch(login_status){
	  case 'login':
	    self.user_status_css("login");
	  break;
	  case 'logout':
	    self.user_status_css("logout");
	  break;
	  case 'no_applicant':
	    self.user_status_css("no_applicant");
	  break;
	}
}

user_status_VM.prototype.update_button_status = function(role_name){
	var self = this;
	var parse_id_of_this_role = appmgr.participant_manager_object.getParseID_fromRole(role_name);
	var is_login = appmgr.participant_manager_object.is_Login(role_name);
	var is_own_group = appmgr.participant_manager_object.is_OwnGroup(role_name);
	var is_my_role = appmgr.participant_manager_object.is_OwnRole(role_name);
	var is_audience = appmgr.participant_manager_object.is_Audience(role_name);
	var is_audience_yourself = appmgr.participant_manager_object.isAudience_yourself();

	if(is_audience){
      self.cancel_visible(false);
      self.join_visible(false);
      self.decline_visible(false);
      if(!parse_id_of_this_role){
      	self.participant_visible(false);
      }else{
      	self.participant_visible(true);
      }
	}else{
		if(parse_id_of_this_role){
			if(is_login){
				if(is_my_role){
					self.cancel_visible(true);
          			self.join_visible(false);
          			self.decline_visible(false);
				}else{
					self.cancel_visible(false);
          			self.join_visible(false);
          			self.decline_visible(false);
				}
			}else{
				self.cancel_visible(false);
          		self.join_visible(false);
          		self.decline_visible(true);
			}
		}else{
			if(is_audience_yourself){
				self.cancel_visible(false);
          		self.join_visible(true);
          		self.decline_visible(false);
			}else{
				if(is_own_group){
					self.cancel_visible(false);
          			self.join_visible(true);
          			self.decline_visible(false);
				}else{
					self.cancel_visible(false);
          			self.join_visible(false);
          			self.decline_visible(false);
				}
			}
		}
	}
}



user_status_VM.prototype.update_button_byGamestatus = function(){

	var self = this;
	var game_status = appmgr.game_status;
	switch(game_status){
		case 1:
		case 2:
		case 3:
		break;
		case 4:
		case 5:
		break;
	}
}

user_status_VM.prototype.convert_role_name = function(role_name){

var convert_table = {
	PrimeMinister:"PM",
	LeaderOpposition:"LO",
	MemberGovernment:"MG",
	MemberOpposition:"MO",
	ReplyPM:"RPM",
	LOReply:"LOR",
	DeptyPrimeMinister:"DPM",
	DeptyLeaderOpposition:"DLO",
	GovernmentWhip:"GW",
	OppositionWhip:"OW",
	GovermentReply:"GR",
	OppositionReply:"OR"
 }
 return convert_table[role_name];

}


user_status_VM.prototype.decline = function(){
  
	var self = this;
	self.loading_visible(true);
	var Game = Parse.Object.extend("Game");
	var game_query = new Parse.Query(Game);
	game_query.get(self.game_id , {
	  success: function(game_obj) {
	  	participant_obj = game_obj.get("participant_role");
	  	delete participant_obj[self.role_name];
	  	game_obj.set("participant_role",participant_obj);
	  	var is_debater_exist = false;
	  	var parse_id_ofThisRole = self.parse_id_of_this_role();
	  	for( key in participant_obj){
	  		if(participant_obj[key] == parse_id_ofThisRole){
	  			is_debater_exist = true;
	  		}
	  	}
  	  	if(!is_debater_exist){	
	  		var audience_array = game_obj.get("audience_participants");
	  		if(!audience_array){
	  			audience_array = new Array();
	  		}
	  		audience_array.push(parse_id_ofThisRole);
	  		game_obj.set("audience_participants",audience_array);
	  	}
	  	game_obj.save(null, {
		  success: function(obj) {
		    console.log(obj);

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
		    alert('Failed to save object.' + error.message);
		  }
		});
	  },
	  error: function(object, error) {
	    alert('Failed to save object.' + error.message);
	  }
	});
}

user_status_VM.prototype.join = function(){

	var self = this;
	self.loading_visible(true);
	var Game = Parse.Object.extend("Game");
	var game_query = new Parse.Query(Game);
	game_query.get(self.game_id , {
	  success: function(game_obj) {

	  	participant_obj = game_obj.get("participant_role");
	  	if(participant_obj[self.role_name]){
	  		alert("this role has been already assigned to others");
	  		return;
	  	}
	  	participant_obj[self.role_name] = self.own_parse_id;

	  	audience_array = game_obj.get("audience_participants");
	  	if(audience_array){
		  	for(var i=0; i< audience_array.length; i++){
		  		if(audience_array[i] == self.own_parse_id){
		  			audience_array = audience_array.splice(i+1,1);
		  		}
		  	}
		}
	  	game_obj.set("participant_role",participant_obj);
	  	game_obj.set("audience_participants",audience_array);
	  	game_obj.save(null, {
		  success: function(obj) {
		    console.log(obj);

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
		    alert('Failed to save object.' + error.message);
		  }
		});
	  },
	  error: function(object, error) {
	    alert('Failed to save object.' + error.message);
	  }
	});
}

user_status_VM.prototype.cancel = function(){

	var self = this;
	self.loading_visible(true);
	var Game = Parse.Object.extend("Game");
	var game_query = new Parse.Query(Game);
	game_query.get(self.game_id , {
	  success: function(game_obj) {
	  	participant_obj = game_obj.get("participant_role");
	  	delete participant_obj[self.role_name];
	  	game_obj.set("participant_role",participant_obj);
	  	var is_debater_exist = false;
	  	for( key in participant_obj){
	  		if(participant_obj[key] == self.own_parse_id){
	  			is_debater_exist = true;
	  		}
	  	}
	  	if(!is_debater_exist){	
	  		audience_array = game_obj.get("audience_participants");
	  		if(!audience_array){
	  			audience_array = new Array();
	  		}
	  		audience_array.push(self.own_parse_id);
	  		game_obj.set("audience_participants",audience_array);
	  	}
	  	game_obj.save(null, {
		  success: function(obj) {
		    console.log(obj);



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
		    alert('Failed to save object.' + error.message);
		  }
		});
	  },
	  error: function(object, error) {
	    alert('Failed to save object.' + error.message);
	  }
	});
}


user_status_VM.prototype.cancel_debater_from_hangout = function(){

/*
  var cancel_obj = { game_id: debate_game_id, game_role:, own_user_id: ,own_user_key: };
 
  Parse.Cloud.run('Cloud_Hangout_cancel_debater', cancel_obj,{
    success: function(game_obj) {
    	// update hangout status, participant_role_count ++;
    },
    error: function(error) {
      alert( error.message);
    }
  });
*/
}

user_status_VM.prototype.cancel_audience_from_hangout = function(){
/*
  var cancel_obj = { game_id: debate_game_id, own_user_id: ,own_user_key: };
 
  Parse.Cloud.run('Cloud_Hangout_cancel_debater', cancel_obj,{
    success: function(game_obj) {
    	// update hangout status, participant_role_count ++;
    },
    error: function(error) {
      alert( error.message);
    }
  });
*/
}


user_status_VM.prototype.enable_user_participant_change = function(status){
  
	var self = this;
// statusがPreparation前になったときに、Joinボタンおよびdeclineボタンを表示
// 　→ユーザ設定がありで未ログイン
// 　　　→Declineボタンを表示
// 　→ユーザ設定なしで、同一チームのロールか、Audienceのとき
// 　　　→Joinボタンを表示  
  
}

