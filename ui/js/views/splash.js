define([
	'jquery',
	'underscore',
	'backbone',
	'collections/devices',
	'text!/templates/splash.html'
], function($, _, Backbone, DeviceCollection, splashTemplate){
	var SplashView = Backbone.View.extend({
		el: function() { return $('#content'); },
		
		events: {
			'click [data-action="getDevices"]'		: 'getDevices'
		},
		
		initialize: function() {
			var self = this;
			
			this.collection = new DeviceCollection();
			
			this.listenTo(this.collection, 'sync', this.showDevices);
			
			this.collection.fetch();
			
		},
		
		showDevices: function() {
			
		},
		
		render: function(){
			var data = {},
					compiledSplash = _.template(splashTemplate, data);
			this.$el.append(compiledSplash);
		}
		
	});
	
	return SplashView;
});