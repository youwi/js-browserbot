var util = require('util');
var phantom = require('phantom');
var EventEmitter = require('events').EventEmitter;

/**
 * A browser
 * @constructor
 */
function Browser() {

	if (!(this instanceof Browser)) {
		return new Browser();
	}

	this.phantom  = null;
	this.page     = null;
	this.debug    = require('debug')('browser');

}
util.inherits(Browser, EventEmitter);

/**
 * Set the viewport size
 * @param   {Number} width
 * @param   {Number} height
 * @returns {BrowserBot}
 */
Browser.prototype.setViewport = function(width, height) {
	this.debug('.viewport() set to '+width+'x'+height)
	this.page.setViewportSize(width, height);
	return this;
};

/**
 * Execute a plugin
 * @param   {Function} plugin
 * @returns {BrowserBot}
 */
Browser.prototype.use = function(plugin) {
	plugin(this);
	return this;
};

/**
 * Setup the browser
 * @param   {Function} callback
 * @returns {BrowserBot}
 */
Browser.prototype.setup = function(callback) {
	var self = this;

	phantom.create(function(phantom) {
		self.phantom = phantom;

		phantom.createPage(function(page) {
			self.page = page;

			// === register event handlers ===

			page.set('onError', function(msg, trace) {
				var error;

				if (msg.substr(0, 11) === 'TypeError: ') {
					error = new TypeError(msg.substr(11));
				} else if (msg.substr(0, 7) === 'Error: ') {
					error = new Error(msg.substr(7));
				} else {
					error = new Error(msg);
				}

				error.phantomTrace = trace;

				self.emit('Error', error);
			});

			page.set('onLoadStarted', function(status) {
				self.emit('LoadStarted', status);
			});

			page.set('onLoadFinished', function(status) {
				self.emit('LoadFinished', status);
			});

			page.set('onConsoleMessage', function(msg, line, source) {
				self.emit('ConsoleMessage', msg, line, source);
			});

			if (callback) callback.call(self);

		});

	});

	return this;
};

/**
 * Destroy the session
 * @returns {BrowserBot}
 */
Browser.prototype.destroy = function() {

	if (this.page) this.page.close(function() {
		console.log('closed');
	});

	if (this.phantom) this.phantom.exit();

	this.page = null;
	this.phantom = null;

	return this;
};

//Browser.prototype.on = Browser.prototype.addListener;
Browser.prototype.off = Browser.prototype.removeListener;

module.exports = Browser;

function mixin(methods) {
	for (var method in methods) {
		Browser.prototype[method] = methods[method];
	}
	return this;
}

mixin(require('./browser-page'));
mixin(require('./browser-nav'));
mixin(require('./browser-dom'));