
function Argument_Mgr(){

	var self = this;
	self.Argument_list = new Array();
	self.general_concept_id = null;
	self.definition = null;
	self.team_side = null;
	self.current_type = null;

}


Argument_Mgr.prototype.initialize = function(general_concept_id, definition, argument_id_array, team_side, current_type){

	var self = this;
	
	if(general_concept_id){
		self.general_concept_id = general_concept_id;

		var GeneralConcept_html_Template = _.template($('[data-template="GeneralConcept_Template"]').html());
	    var general_concept_element = $("#general_concept_area");
	    var general_concept_html_text = GeneralConcept_html_Template();
	    transcription_element.html(general_concept_html_text);

	    self.concept_vm = new GeneralConcept_VM();
	    var argument_el = document.getElementById('transcription_area');
	    ko.applyBindings(self.transcription_mgr , transcription_el);
	    self.transcription_mgr.initialize(self.game_obj.speech_transcription_id);

	}


	// Argumentがなかったら作成、あったらアップデート
	//データ取得

	// IDがなかったらParse上にオブジェクトを二つ作成し書くオブジェクトIDにひもづき、
	// Argumentcontextを作成
	
	// IDがあったら、オブジェクトを作成
}


Argument_Mgr.prototype.update = function(){

	//データ再取得
	//　self.Argument_listにないものがあったら、
	//ArgumentContextを作成
	
	// update objectで、変更されたObjectの名前を受け取り、それを変更
	//カウンタで、同期済みのものと、同期していないものを区別し、同期済みの配列のうち、ユニークなものを更新
	//  
	

}


