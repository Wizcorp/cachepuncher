function Puncher(defaults) {
	this.defaults = defaults;
	this.lastTime = null;
	this.bumps = {
		sec: 0,
		msec: 0
	};
	this.queryVar = 'rand';
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

Puncher.prototype.punchMe = function (source, options) {
	var queryVar = this.queryVar;
	if (options) {
		if (options.queryVar) {
			queryVar = options.queryVar;
		}
	}
	var url = require('url');
	var parsedURL = url.parse(source);
	// .query returns null if the query string does not exist
	if (parsedURL.query != null) {
		// Query string exists
		return source + '&' + queryVar + '=' + this.punch(options);
	} else {
		// No query string exists
		return source + '?' + queryVar + '=' + this.punch(options);
	}
};


var defaultPuncher = new Puncher();

exports.punch = function (options) {
	return defaultPuncher.punch(options);
};

exports.punchMe = function (source, options) {
	return defaultPuncher.punchMe(source, options);
};

exports.create = function (defaults) {
	var puncher = new Puncher(defaults);

	return function (options) {
		return puncher.punch(options);
	};
};
