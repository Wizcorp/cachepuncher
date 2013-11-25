function Puncher(defaults) {
	this.defaults = defaults;
	this.lastTime = null;
	this.bumps = {
		sec: 0,
		msec: 0
	};
}


Puncher.prototype.punch = function (options) {
	if (options) {
		if (this.defaults) {
			for (var key in this.defaults) {
				if (this.defaults.hasOwnProperty(key) && !options.hasOwnProperty(key)) {
					options[key] = this.defaults[key];
				}
			}
		}
	} else {
		options = this.defaults || {};
	}

	var precision = options.msec ? 'msec' : 'sec';
	var bump;

	var now = options.now || new Date();
	var ts = now.getTime();

	var collision =
		precision === 'msec' ?
		this.lastTime === ts :
		Math.floor(this.lastTime / 1000) === Math.floor(ts / 1000);

	this.lastTime = ts;

	if (collision) {
		bump = this.bumps[precision] += 1;
	} else {
		bump = this.bumps[precision] = 1;
	}

	var out = ts;

	if (options.epoch instanceof Date) {
		out -= options.epoch.getTime();
	}

	if (precision === 'sec') {
		out = Math.floor(out / 1000);
	}

	if (typeof options.base === 'number') {
		out = out.toString(options.base);
	}

	out += '-' + bump;

	return out;
};


var defaultPuncher = new Puncher();

exports.punch = function (options) {
	return defaultPuncher.punch(options);
};


exports.create = function (defaults) {
	var puncher = new Puncher(defaults);

	return function (options) {
		return puncher.punch(options);
	};
};

