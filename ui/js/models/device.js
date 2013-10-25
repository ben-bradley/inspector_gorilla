define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var DeviceModel = Backbone.Model.extend({
		
		defaults: {
			hostname: null,
			community: null
		}
		
	});
	return DeviceModel;
});