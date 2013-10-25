define([
	'underscore',
	'backbone',
	'models/device'
], function(_, Backbone, DeviceModel) {
	var DeviceCollection = Backbone.Model.extend({
		
		url: '/api/devices',
		
		model: DeviceModel,
		
		startHub: function() {
			var model = this;
			$.get('api/hub/start', function(res) {
				console.log(res);
				model.fetch();
			});
		},
		
		stopHub: function() {
			var model = this;
			$.get('api/hub/stop', function(res) {
				console.log(res);
				model.fetch();
			});
		}
		
	});
	return DeviceCollection;
});