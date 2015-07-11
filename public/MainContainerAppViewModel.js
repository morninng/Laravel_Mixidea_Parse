
function ContainerMainAppViewModel() {
  var self = this;
  self.left_column_css_class = ko.observable();
  self.center_column_css_class = ko.observable();
  self.right_column_css_class = ko.observable();
  self.center_column_existence = ko.observable();
  self.construct_three_column();
  
}

ContainerMainAppViewModel.prototype.construct_two_column = function(){
	var self = this;
	self.left_column_css_class("two_Column_left_pain");
	self.center_column_css_class("two_Column_center_pain");
	self.right_column_css_class("two_Column_right_pain");
	self.center_column_existence(false);
}


ContainerMainAppViewModel.prototype.construct_three_column = function(){
	var self = this;
	self.left_column_css_class("three_Column_left_pain");
	self.center_column_css_class("three_Column_center_pain");
	self.right_column_css_class("three_Column_right_pain");
	self.center_column_existence(true);
}



