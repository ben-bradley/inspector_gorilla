require.config({
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		bootstrap: 'libs/bootstrap',
		socketio: '../../socket.io/socket.io'
	}
});

require([
	'app'
], function(App) {
	App.initialize();
});