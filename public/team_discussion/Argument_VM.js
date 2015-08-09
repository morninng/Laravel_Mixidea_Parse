
function Argument_VM(){

	var self = this;
	self.argument_title = null;
	self.argument_context = null;
	self.link_list = new Array();
	self.extension_list = new Array();
	self.refute_list = new Array();
	self.comment_list = new Array();

}

Argument_VM.prototype.initialize = function(argument_id){

	selr.argument_id = argument_id;
	// retrieve data.
/*
	self.link_list = 
	self.extension_list = 
	self.refute_list = 
	self.comment_list = 
	*/
}



Argument_VM.prototype.update = function(id){


	//更新中のIDを取得し、それは変更不可にする。
	//それ以外で、自分と同じグループのものは変更可能
	

}


