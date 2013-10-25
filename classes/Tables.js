var Class = require('class.extend');

module.exports = Class.extend({
	
	init: function() {
		this.list = [
			{
				keyedOn: 'ifIndex',
				name: 'ifTable',
				oid: '1.3.6.1.2.1.2.2.1',
				attrs: {
					'1': { name: 'ifIndex' },
					'2': { name: 'ifDescr', stringType: 'utf8' },
					'3': { name: 'ifType' },
					'4': { name: 'ifMtu' },
					'5': { name: 'ifSpeed' },
					'6': { name: 'ifPhysAddress', stringType: 'hex' },
					'7': { name: 'ifAdminStatus', metric: true },
					'8': { name: 'ifOperStatus', metric: true },
					'9': { name: 'ifLastChange' },
					'10': { name: 'ifInOctets', metric: true },
					'11': { name: 'ifInUcastPkts', metric: true },
					'12': { name: 'ifInNUcastPkts', metric: true },
					'13': { name: 'ifInDiscards', metric: true },
					'14': { name: 'ifInErrors', metric: true },
					'15': { name: 'ifInUnknownProtos', metric: true },
					'16': { name: 'ifOutOctets', metric: true },
					'17': { name: 'ifOutUcastPkts', metric: true },
					'18': { name: 'ifOutNUcastPkts', metric: true },
					'19': { name: 'ifOutDiscards', metric: true },
					'20': { name: 'ifOutErrors', metric: true },
					'21': { name: 'ifOutQLen', metric: true },
					'22': { name: 'ifSpecific' }
				}
			},
			
			{
				keyedOn: 'ifIndex',
				name: 'ifXTable',
				oid: '1.3.6.1.2.1.31.1.1.1',
				attrs: {
					'1': { name: 'ifName', stringType: 'utf8' },
					'2': { name: 'ifInMulticastPkts', metric: true },
					'3': { name: 'ifInBroadcastPkts', metric: true },
					'4': { name: 'ifOutMulticastPkts', metric: true },
					'5': { name: 'ifOutBroadcastPkts', metric: true },
					'6': { name: 'ifHCInOctets', metric: true },
					'7': { name: 'ifHCInUcastPkts', metric: true },
					'8': { name: 'ifHCInMulticastPkts', metric: true },
					'9': { name: 'ifHCInBroadcastPkts', metric: true },
					'10': { name: 'ifHCOutOctets', metric: true },
					'11': { name: 'ifHCOutUcastPkts', metric: true },
					'12': { name: 'ifHCOutMulticastPkts', metric: true },
					'13': { name: 'ifHCOutBroadcastPkts', metric: true },
					'14': { name: 'ifLinkUpDownTrapEnable' },
					'15': { name: 'ifHighSpeed' },
					'16': { name: 'ifPromiscuousMode' },
					'17': { name: 'ifConnectorPresent' },
					'18': { name: 'ifAlias', stringType: 'utf8' },
					'19': { name: 'ifCounterDiscontinuityTime' }
				}
			}
		]
	},
	
	metrics: function() {
		var list = [];
		this.list.forEach(function(table) {
			for (var a in table.attrs) {
				if (table.attrs[a].metric) {
					var m = table.attrs[a];
					m.oid = table.oid+'.'+a;
					list.push(m);
				}
			}
		});
		return list;
	}
	
});