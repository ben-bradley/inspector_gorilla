var Class = require('class.extend'),
		snmp = require('net-snmp'),
		events = require('events'),
		Tables = require('./Tables'),
		Interface = require('./Interface');

// device model
var Device = Class.extend({
	
	init: function(device) {
		
		this.created = new Date().getTime();
		this.updated = 0;
		this.hostname = device.hostname;
		this.community = device.community;
		this.interfaces = {};
		
		this.snmp = snmp.createSession(this.hostname, this.community);
		
	},
	
	// device profile expires after 10 mins
	isExpired: function() {
		var now = new Date().getTime();
		return now - this.updated > 60000;
	},
	
	// update the whole device
	update: function() {
		var tables = new Tables(),
				self = this;
		this.on('tableUpdated', function() {
			var done = true;
			tables.list.forEach(function(table) { done = (table.updated === false) ? false : done; });
			if (done === true) {
				// process the responses
				tables.list.forEach(function(table) {
					table.response.forEach(function(res) {
						var vb = new Vb(res),
								attr = table.attrs[vb.attr],
								interface = (self.interfaces[vb.i]) ? self.interfaces[vb.i] : { _hostname: self.hostname, _community: self.community, attrs: {} };
						interface.attrs[attr.name] = (attr.stringType) ? vb.val.toString(attr.stringType) : vb.val;
						self.interfaces[vb.i] = interface;
					});
				});
				// all interfaces.attrs built, build the interface classes
				for (var i in self.interfaces) {
					self.interfaces[i] = new Interface(self.interfaces[i])
				}
				self.updated = new Date().getTime();
				self.emit('updated');
			}
		});
		// poll the tables
		tables.list.forEach(function(table) {
			table.response = []
			table.updated = false;
			var feedCb = function(vbs) { table.response.push(vbs[0]); }
			var doneCb = function(err) {
				if (err) { table.error = err; }
				table.updated = true;
				self.emit('tableUpdated');
			}
			self.snmp.subtree(table.oid, feedCb, doneCb);
		});
	},
	
	// return a single interface ensuring it's updated
	get: function(ifDescr, callback) {
		var interface = {};
		for (var i in this.interfaces) {
			if (this.interfaces[i].attrs.ifDescr == ifDescr) { interface = this.interfaces[i]; }
		}
		if (interface && interface.updated == 0) { // interface is unpolled
			interface.once('updated', function() { callback(interface); });
			interface.update();
		}
		else if (interface && interface.isExpired()) { // interface is expired
			interface.update();
			callback(interface);
		}
		else { // interface is current
			callback(interface);
		}
	}
	
});

Device.prototype.__proto__ = events.EventEmitter.prototype;

function Vb(vb) {
	var oids = vb.oid.split('.'),
			attr = oids[oids.length-2],
			i = oids[oids.length-1];
	return { oid: vb.oid, attr: attr, i: i, val: vb.value };
}

module.exports = Device;
