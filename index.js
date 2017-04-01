// State carries the time and bump state at a particular precision (factor)

function State(factor) {
	this.factor = factor || 1;
	this.bump = 0;
	this.time = null;
}


State.prototype.setTime = function (ts) {
	var collides = false;

	if (this.time) {
		// apply the factor and compare the timestamps for collisions

		collides = Math.floor(ts * this.factor) === Math.floor(this.time * this.factor);
	}

	this.time = ts;

	if (collides) {
		this.bump += 1;
	} else {
		this.bump = 1;
	}
};


// The Puncher class exposes the punch method and carries multiple precision states

function Puncher(defaults) {
	this.defaults = defaults;

	this.states = {
		sec: new State(0.001),
		msec: new State()
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

	// pick a state based on our precision

	var state = options.msec ? this.states.msec : this.states.sec;

	// assign the current time to the state

	var now = options.now || new Date();
	var ts = now.getTime();

	state.setTime(ts);

	// generate an output string

	var out = ts;

	if (options.epoch instanceof Date) {
		out -= options.epoch.getTime();
	}

	if (!options.msec) {
		out = Math.floor(out / 1000);
	}

	if (typeof options.base === 'number') {
		out = out.toString(options.base);
	}

	out += '-' + state.bump;

	return out;
};

Puncher.prototype.punchMe = function (source, options) {
	var queryVar = this.queryVar;
	if (options) {
		if (options.queryVar) {
			queryVar = options.queryVar;
		}
	}
	
	// Check for a query string
	if (source.match(/\?/)) {
		// Query string exists
		return source + '&' + queryVar + '=' + this.punch(options);
	} else {
		// No query string exists
		return source + '?' + queryVar + '=' + this.punch(options);
	}
};


// Expose the default punch method

var defaultPuncher = new Puncher();

exports.punch = function (options) {
	return defaultPuncher.punch(options);
};

exports.punchMe = function (source, options) {
	return defaultPuncher.punchMe(source, options);
};

// A factory for new cache punchers

exports.create = function (defaults) {
	var puncher = new Puncher(defaults);

	return function (options) {
		return puncher.punch(options);
	};
};
