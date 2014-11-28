var util = require('util');
var phantom = require('phantom');
var EventEmitter = require('events').EventEmitter;

/**
 * Create a browser
 * @constructor
 */
function Browser() {

	if (!(this instanceof Browser)) {
		return new Browser();
	}

	this.phantom  = null;
	this.page     = null;
	this.queue    = [];
}

util.inherits(Browser, EventEmitter);

/**
 * Queue a method
 * @param   {Function} callback
 * @returns {Browser}
 */
Browser.prototype.use = function(method) {
	this.queue.push([method, []]);
	return this;
};

/**
 * Run the browser commands
 * @param   {Function} callback
 * @returns {Browser}
 */
Browser.prototype.run = function(callback) {
	var self = this;

	phantom.create(function(phantom) {
		self.phantom = phantom;

		phantom.createPage(function(page) {
			self.page = page;

			/**
			 * Clean up resources
			 */
			function clean() {
				self.page.close();
				self.phantom.exit();

				self.page = null;
				self.phantom = null;
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

				//create a copy of the arguments and append the `next` callback
				var args = cmd[1].slice();
				args.push(next);

				//execute the command
				var method = cmd[0];
				self.error = undefined;
				method.apply(self, args);

			}

			// === register event handlers ===

			//catch and emit errors
			page.onError = function(msg, trace) {
				self.emit('Error', { message: msg, trace: trace});
			};

			page.set('onLoadStarted', function(status) {
				self.emit('LoadStarted', status);
			});

			page.set('onLoadFinished', function(status) {
				self.emit('LoadFinished', status);
			});

			page.set('onConsoleMessage', function(msg, line, source) {
				self.emit('ConsoleMessage', status);
			});

			// === run commands ===

			next();

		});

	});

	return this;
};

/**
 * Mixin some actions
 * @param   {Object} actions
 */
function mixin(actions) {
	Object.keys(actions).forEach(function(method) {
		Browser.prototype[method] = function() {

			//turn the arguments into a proper array
			var args = [].slice.call(arguments);

			//queue the command for execution
			this.queue.push([
				actions[method],
				args
			]);

			return this;
		};
	});

}

mixin(require('./actions/dom'));
mixin(require('./actions/nav'));
mixin(require('./actions/page'));

module.exports = Browser;