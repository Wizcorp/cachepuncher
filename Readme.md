# cachepuncher

Punch browser caching straight in the cache!

![Cockpuncher (the Onion Movie)](./cockpuncher.jpg)

Don't you just hate browsers that cache overly aggressively? Yes, I'm looking at you Chrome and
Mobile Safari, you rule breaking maniacs. It's time for the cache puncher!

This tiny piece of software will generate a unique time-based code that you can inject into your
URLs whenever you need to do some ajax or image loading. It guarantees no two codes are the same,
even if generated within the same millisecond. It comes with a few options to further shrink down
the code if you care a lot about saving a few extra precious bytes.

## Installation

Install with [component(1)](http://component.io):

	$ component install wizcorp/cachepuncher

## The output format

Cache puncher always returns a code that is URL friendly, so no further URL escaping is needed
(though it won't break if you do encode it). The output format is a numerical (base 2-36, you
choose) timestamp, followed by an iteration number to avoid collisions within a single timestamp.
You may change the output rules for each punch, and cache puncher will still guarantee uniqueness
for each generated code.

## API

A cache puncher instance has only one function that will keep generating unique codes: `punch`.

### Simple example

Example:

```js
var punch = require('cochepuncher').punch;

var image = new Image();
image.src = 'http://example.com/punch.jpg?rand=' + punch();
```

### Arguments

The `punch` function takes arguments:

```js
var code = puncher.punch({
	msec: true,
	base: 16,
	epoch: new Date(2013, 0, 1, 0, 0, 0)
});
```

| option | type    | default    | meaning |
|--------|---------|------------|---------|
| msec   | boolean | false      | Output milliseconds. Useful (but not required) if you need many codes per second. |
| base   | number  | 10         | Output the code in base-N, eg 16 for hex. Must be between 2 and 36. |
| epoch  | Date    | unix epoch | Set a custom epoch, to lower the output number. |

### Cache puncher instances

You can use the default cache puncher as shown in the example above, or you can create your own
with default settings for the punch function.

Example:

```js
var puncher = require('cachepuncher');
var punch = puncher.create({ base: 36 });  // output in base 36 by default

var image = new Image();
image.src = 'http://example.com/punch.jpg?rand=' + punch();
```

## About the name

It's a wink to the fake movie Cock Puncher starring the awesome
[Steven Seagal](http://www.imdb.com/name/nm0000219/), featured in the hilarious
[The Onion Movie](http://www.imdb.com/title/tt0392878/). I wish they made Cock Puncher an actual
movie. Please don't sue me for using the image, and don't punch my cock either please.

## License

MIT
