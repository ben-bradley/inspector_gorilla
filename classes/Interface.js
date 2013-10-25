var Class = require('class.extend'),
		snmp = require('net-snmp'),
		events = require('events'),
		Tables = require('./Tables');

// interface model
var Interface = Class.extend({
	
	init: function(interface) {
		this._hostname = interface._hostname;
		this._community = interface._community;
		this.attrs = interface.attrs;
		this.updated = 0;
	},
	
	// interface data expires after 5 seconds
	isExpired: function() {
		var now = new Date().getTime();
		return now - this.updated > 5000; // 5 second expiry
	},
	
	// repoll the interface
	update: function() {
		var tables = new Tables(),
				metrics = tables.metrics(),
				oids = [],
				sess = snmp.createSession(this._hostname, this._community),
				self = this;
		
		metrics.forEach(function(metric) {
			if (self.attrs[metric.name]) { // only poll metrics that have been found on the initial walk
				oids.push(metric.oid+'.'+self.attrs.ifIndex);
			}
		});
		
		// initiate the poll
		sess.get(oids, function(err, varbinds) {
			if (err) { console.log(err); }
			if (varbinds) {
				varbinds.forEach(function(v) {
					var vb = new Vb(v),
							attr = {};
					metrics.forEach(function(metric) {
						if (metric.oid == vb.oid.replace('.'+vb.i,'')) {
							self.attrs[metric.name] = (metric.stringType) ? vb.val.toString(metric.stringType) : vb.val;
						}
					});
				});
			}
			self.updated = new Date().getTime();
			self.emit('updated');
		});
	}
	
});

Interface.prototype.__proto__ = events.EventEmitter.prototype;

function Vb(vb) {
	var oids = vb.oid.split('.'),
			attr = oids[oids.length-2],
			i = oids[oids.length-1];
	return { oid: vb.oid, attr: attr, i: i, val: vb.value };
}

module.exports = Interface;
