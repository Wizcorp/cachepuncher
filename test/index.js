var puncher = require('../index.js');
assert = require('assert');


function parse(code) {
	var m = code.match(/^([0-9a-z]+)-([0-9]+)$/);
	if (!m) {
		throw new Error('Code is not valid: ' + code);
	}

	return {
		time: m[1],
		bump: parseInt(m[2], 10)
	};
}


describe('puncher', function () {
	it('Should expose a default puncher', function () {
		assert.strictEqual('string', typeof puncher.punch({ msec: true, base: 2 }));
	});

	it('Should expose a creator function', function () {
		assert.strictEqual('function', typeof puncher.create({ msec: true, base: 2 }));
	});

	it('Should yield strings', function () {
		var punch = puncher.create();

		assert.strictEqual('string', typeof punch());
		assert.strictEqual('string', typeof punch({ base: 2 }));
		assert.strictEqual('string', typeof punch({ msec: true }));
		assert.strictEqual('string', typeof punch({ epoch: new Date() }));
	});

	it('Should never yield the same string twice', function () {
		var punch = puncher.create();

		assert.notStrictEqual(punch(), punch());
		assert.notStrictEqual(puncher.punch(), puncher.punch());
	});

	it('Should always contain a bump', function () {
		var punch = puncher.create();

		assert.strictEqual(true, !!puncher.punch().match(/^[0-9]+-[0-9]+$/));
	});

	it('Should reset the bump if the seconds changed', function (done) {
		var punch = puncher.create();

		punch({ msec: true });
		parse(punch());

		setTimeout(function () {
			punch({ msec: true });
			var code = parse(punch());

			assert.strictEqual(1, code.bump);
			done();
		}, 1000);
	});

	it('Should output seconds when not passing msec: true', function () {
		var before = Math.floor(Date.now() / 1000);
		var out = puncher.punch();
		var after = Math.floor(Date.now() / 1000);

		var code = parse(out);
		var ts = parseInt(code.time, 10);

		assert.ok(ts);
		assert.strictEqual(true, ts >= before);
		assert.strictEqual(true, ts <= after);
	});

	it('Should output milliseconds when passing msec: true', function () {
		var before = Date.now();
		var out = puncher.punch({ msec: true });
		var after = Date.now();

		var code = parse(out);
		var ts = parseInt(code.time, 10);

		assert.strictEqual(true, ts >= before);
		assert.strictEqual(true, ts <= after);
	});

	it('Should not yield the same string twice on the same timestamp', function () {
		var punch = puncher.create();
		var now = new Date();

		assert.strictEqual(false, punch({ now: now }) === punch({ now: now }));
	});

	it('Should be able to use alternative input time', function () {
		var punch = puncher.create();
		var now = new Date(2010, 0, 1, 0, 0, 0);

		assert.strictEqual(now.getTime() + '-1', punch({ now: now, msec: true }));
		assert.strictEqual(now.getTime() + '-2', punch({ now: now, msec: true }));
		assert.strictEqual(now.getTime() + '-3', punch({ now: now, msec: true }));
	});

	it('Should return only hex strings when using base16', function () {
		var punch = puncher.create();

		var now = new Date();
		var a = Date.now().toString(16) + '-1';
		var b = punch({ base: 16, msec: true, now: now });

		assert.strictEqual(a, b);
	});

	it('Should be able to reduce the output with an epoch', function () {
		var punch = puncher.create();

		var now = new Date();
		var epoch = new Date(now.getTime() - 1); // 1 msec before now

		assert.strictEqual('1-1', punch({ now: now, epoch: epoch, msec: true }));
	});
});

