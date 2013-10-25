var express = require('express'),
		app = express(),
		Devices = require('./classes/Devices');

var devices = new Devices();

// Serve the UI
app.configure(function() {
	
	// app configs
	app.use(express.bodyParser()); // handle POST/PUT
	app.use(express.cookieParser()); // enable sessions
	app.use(express.session({ secret: 'blargh' })); // configure sessions
	
	app.use('/', express.static(__dirname+'/ui'));
	
	app.get('/api/devices', function(req, res) {
		devices.getList(function(list) {
			res.send(list);
		});
	});
	
	app.get('/api/devices/:hostname', function(req, res) {
		devices.get(req.params.hostname, function(device) {
			res.send(device);
		});
	});
	
	app.get('/api/devices/:hostname/*', function(req, res) {
		devices.get(req.params.hostname, function(device) {
			if (device) {
				device.get(req.params[0], function(interface) {
					res.send(interface);
				});
			}
			else {
				res.send({});
			}
		});
	});
	
});

// start the UI
app.listen(8087);
