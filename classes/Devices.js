var Class = require('class.extend'),
		events = require('events'),
		http = require('http'),
		_ = require('underscore'),
		Device = require('./Device');

// devices collection
var Devices = Class.extend({
	
	init: function() {
		
		this.updated = 0;
		this.list = {};
		
		this.update();
		
	},
	
	// list expires after 10 mins
	isExpired: function() {
		var now = new Date().getTime();
		return now - this.updated > 60000;
	},
	
	// update the list
	update: function() {
		var data = '',
				self = this;
		// this REST request is pulling back an array of objects like: [ { hostname: 'fqdn', community: 'readonly' }, ... ]
		http.get('http://SOOPERCOOLWEBSERVICE/?list=hostname,community', function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) { data += chunk; });
			res.on('end', function() {
				_.each(JSON.parse(data), function(device) {
					/* Device() needs an object with format of { hostname: 'fqdn', community: 'roCommunity' } */
					self.list[device.hostname] = new Device(device);
				});
				self.updated = new Date().getTime();
				self.emit('updated');
			});
		});
	},
	
	// return a single updated device
	get: function(hostname, callback) {
		var device = this.list[hostname];
		if (device && device.updated == 0) { // device is unpolled
			device.once('updated', function() {
				callback(device);
			});
			device.update();
		}
		else if (device && device.isExpired()) { // device is expired
			device.update();
			callback(device);
		}
		else { // device is current
			callback(device);
		}
	},
	
	// return the list of hostnames ensuring it's current
	getList: function(callback) {
		var self = this;
		if (this.updated == 0) {
			this.once('updated', function() { callback(_.map(self.list, function(d) { return d.hostname; })); });
			this.update();
		}
		else if (this.isExpired()) {
			this.update();
			callback(_.map(self.list, function(d) { return d.hostname; }));
		}
		else {
			callback(_.map(self.list, function(d) { return d.hostname; }));
		}
	}
	
});

Devices.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Devices;