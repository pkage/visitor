var wc = require('wifi-control')
var sudo = require('sudo-prompt')
var macaddress = require('macaddress')
var fs = require('fs')

app = new Vue({
	el: '#app',
	data: {
		iface: '',
		addr: '',
		og_addr: '',
		cfg: {}
	},

	methods: {
		errorOut: function(err) {
			this.openPopup('#errorPopup')
		},
		getAddr: function() {
			macaddress.one(this.iface.interface, (err, mac) => {
				if (err) {
					this.errorOut();
				} else {
					this.addr = mac;
				}
			});
		},
		setAddr: function(addr, cb) {
			sudo.exec('ifconfig ' + this.iface.interface + ' ether ' + addr, {
				name: 'visitor',
				icns: 'assets/img/visitor.icns'
			},cb);
		},
		loadCfg: function() {
			try {
				this.cfg = JSON.parse(fs.readFileSync('cfg.json', {encoding: 'ascii'}));
			} catch(e) {
				fs.writeFileSync('cfg.json', JSON.stringify({'og_addr': this.addr}));
				this.loadCfg();
			}

			this.og_addr = this.cfg.og_addr;
		},
		openPopup: function(sel) {
			u('.popup').addClass('hidden');
			u(sel).removeClass('hidden');
		},
		closePopup: function() {
			u('.popup').addClass('hidden');
		},
		getHex: function() {
			var hex = '0123456789abcdef';
			return hex[Math.floor(Math.random() * hex.length)];
		},
		toggleMask: function() {
			this.openPopup('#waitPopup');
			var addr;
			if (this.addr == this.og_addr) {
				// get a new addr
				addr = this.addr.split(':');

				// lazy but whatever
				addr[addr.length - 2] = this.getHex() + this.getHex();
				addr[addr.length - 1] = this.getHex() + this.getHex();
			} else {
				addr = this.og_addr;
			}

			this.setAddr(addr, function(err, stdout, stderr) {
				if (err || stderr != "") {
					console.log(stderr);
					console.log(err);
					this.errorOut(); return;
				}
				console.log('resetting wifi');
				wc.resetWiFi(_ => {
					this.getAddr();
					//this.openPopup('#wifiPopup')
					this.closePopup();
				});
			}.bind(this));
			
		}
	},

	mounted: function() {
		this.iface = wc.findInterface();
		if (this.iface.success) {
			console.log(this.iface.interface);
		} else {
			this.errorOut();
			return;
		}
		this.loadCfg();

		this.getAddr();

	}
})