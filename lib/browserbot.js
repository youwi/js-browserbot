var util = require('util');
var debug = require('debug')('BrowserBot');
var Browser = require('./browser');
var EventEmitter = require('events').EventEmitter;

/**
 * Create a browser queue
 * @constructor
 * @param   {Object} settings
 */
function BrowserBot(settings) {

	if (!(this instanceof BrowserBot)) {
		return new BrowserBot(settings);
	}

	this.settings = settings || {};
	this.commands = [];
	this.debug    = debug;

}

util.inherits(BrowserBot, EventEmitter);

/**
 * Apply a plugin
 * @param   {Function} plugin
 * @returns {BrowserBot}
 */
BrowserBot.prototype.use = function(plugin) {
	plugin(this);
	return this;
};

/**
 * Queue a command
 * @param   {Function} command
 * @returns {BrowserBot}
 */
BrowserBot.prototype.queue = function(command) {
	this.commands.push({ fn: command, args: [] });
	return this;
};

/**
 * Run the queued methods
 * @param   {Function} callback
 * @returns {BrowserBot}
 */
BrowserBot.prototype.run = function(callback) {
	var self = this;

	Browser.create(this.settings, function(browser) {

		//forward events
		var emit = browser.emit;
		browser.emit = function() {
			self.emit.apply(self, arguments);
			emit.apply(browser, arguments);
		};

		/**
		 * Clean up resources
		 */
		function clean() {
			browser.destroy();
		}

		/**
		 * Run the next command
		 * @param   {Error} err
		 */
		function next(err) {

			//exit there was an error
			if (err) {
				clean();
				browser.debug('An error occurred whilst executing command: %s', err);
				if (callback) callback(err);
				return;
			}

			//exit we have no more commands
			if (self.commands.length === 0) {
				clean();
				if (callback) callback();
				return;
			}

			//get the next command
			var cmd = self.commands.shift();

			//create a copy of the parameters and append the `next` callback
			var fn      = cmd.fn;
			var args    = cmd.args.slice();
			args.unshift(browser);
			args.push(next);

			//execute the command
			fn.apply(self, [browser, next]);

		}

		next();
	});

	return this;
};

/**
* Minix methods
* @param  {Object} methods
*/
function mixin(methods) {
	Object.keys(methods).forEach(function(name) {
		BrowserBot.prototype[name] = methods[name];
	});
}

mixin(require('./BrowserBot-dom'));
mixin(require('./BrowserBot-nav'));
mixin(require('./BrowserBot-page'));
mixin(require('./BrowserBot-wait'));

module.exports = BrowserBot;