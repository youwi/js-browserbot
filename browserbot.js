var util = require('util');
var Browser = require('./lib/browser');
var EventEmitter = require('events').EventEmitter;

/**
 * Create a browser queue
 * @constructor
 */
function BrowserBot() {

	if (!(this instanceof BrowserBot)) {
		return new BrowserBot();
	}

	this.browser  = new Browser();
	this.queue    = [];
}

util.inherits(BrowserBot, EventEmitter);

/**
 * Queue a plugin method
 * @param   {Function} callback
 * @returns {BrowserBot}
 */
BrowserBot.prototype.use = function(method) {
	this.queue.push([method, []]);
	return this;
};

/**
 * Set the viewport width
 * @param   {Number} width
 * @param   {Number} height
 * @returns {BrowserBot}
 */
BrowserBot.prototype.viewport = function(width, height) {
	this.use(function(done) {
		this.browser.setViewport(width, height);
		done();
	});
	return this;
};

/**
 * Wait for an event to be emitted
 * @param   {Number} ms
 * @returns {BrowserBot}
 */
BrowserBot.prototype.wait = function(ms) { //TODO: allow the user to specify a timeout
	this.use(function(done) {
		setTimeout(done, ms);
	});
	return this;
};

/**
 * Wait for an event to be emitted
 * @param   {String} event
 * @returns {BrowserBot}
 */
BrowserBot.prototype.waitForEvent = function(event) { //TODO: allow the user to specify a timeout
	this.use(function(done) {
		this.browser.debug('.waitForEvent() "'+event+'"');
		this.browser.once(event, function() {
			done();
		});
	});
	return this;
};

/**
 * Run the queued methods
 * @param   {Function} callback
 * @returns {BrowserBot}
 */
BrowserBot.prototype.run = function(callback) {
	var self = this;

	/**
	 * Clean up resources
	 */
	function clean() {
		self.browser.destroy();
	}

	/**
	 * Run the next command
	 * @param   {Error} err
	 */
	function next(err) {
		if (err) return clean() || callback(err);
		if (self.queue.length === 0) return clean() || callback();

		//get the next command
		var cmd = self.queue.shift();

		//create a copy of the parameters and append the `next` callback
		var fn      = cmd[0];
		var params  = cmd[1].slice();
		params.push(next);

		//execute the command
		fn.apply(self, params);

	}

	// === setup commands ===

	this.browser.setup(function(err) {
		//todo: handle errors
		next();
	});

	return this;
};

/**
 * Wrap methods to make them queuable
 * @param   {Array<String>} methods
 */
function mixinAndWrapMethods(methods) {
	methods.forEach(function(methodName) {

		function fn() {
			this.browser[methodName].apply(this.browser, arguments);
		}
		fn.nm = methodName;
		fn.args = Browser.prototype[methodName].length;

		BrowserBot.prototype[methodName] = wrap(fn);

	});
}

/**
 * Wrap a method to make it queueable - expects the last param to be a callback, and the user will not provide a callback
 * @param   {Function} method
 * @returns {Function}
 */
function wrap(method) {
	return function() {
		var fn, self = this;

		if (arguments.length === method.args) {

			//user has passed in a callback - wrap theirs but still call ours e.g. queue.title(function(err) {});
			fn = function() {

				var params    = [].slice.call(arguments);
				var done      = params.pop();
				var callback  = params.pop();

				params.push(function(err) {

					if (!err) {
						var params = [].slice.call(arguments);
						params.shift(); //user doesn't need to know if there was an error
						callback.apply(undefined, params);
					}

					done.apply(undefined, arguments);
				});

				method.apply(self, params);
			};

		} else {

			//user has not passed a callback e.g. queue.go(url);
			fn = function() {
				method.apply(self, arguments);
			};

		}

		this.queue.push([
			fn,
			[].slice.call(arguments)
		]);

		return this;
	};
}

mixinAndWrapMethods([
	'go',
	'evaluate', 'type', 'click', 'html',
	'screenshot'
]);

module.exports = BrowserBot;