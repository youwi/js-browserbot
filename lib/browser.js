var util          = require('util');
var debug         = require('debug')('browser');
var phantom       = require('phantom');
var deepmerge     = require('deepmerge');
var EventEmitter  = require('events').EventEmitter;

var DEFAULTS = {
	ssl: {
		protocol:       'tlsv1', //sslv3|sslv2|tlsv1|any
		ignore_errors:  false
	}
};

/**
 * Mixin browser methods
 * @param   {Object} methods
 */
function mixin(methods) {
	for (var method in methods) {
		Browser.prototype[method] = methods[method];
	}
}

function forwardEvents(events, page, emitter) {
	for (var i=0; i<events.length; ++i) {
		forwardEvent(events[i], page, emitter);
	};
}

function forwardEvent(event, page, emitter) {
	page.set('on'+event, function() {
		var args = [].slice.call(arguments);
		args.unshift(event);
		emitter.emit.apply(emitter, args);
	});
}

/**
 * A browser
 * @constructor
 * @param   {Object} phantom
 * @param   {Object} page
 * @param   {Object} [options]
 */
function Browser(phantom, page, options) {
	var self = this;

	if (!(this instanceof Browser)) {
		return new Browser(phantom, page, options);
	}

	if (!phantom || !page) {
		throw new Error('Invalid browser arguments');
	}

	this.debug    = debug;

	this.phantom  = phantom;
	this.page     = page;
	this.options  = options;

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

		error.trace = trace;

		self.emit('Error', error);
	});

	page.set('onResourceError', function(err) {
		var error = new Error(err.errorString+' for URL '+err.url);
		error.no    = err.id; //request number
		error.url   = err.url;
		error.code  = err.code;
		self.emit('ResourceError', error);
	});

	forwardEvents([
		'Initialised', 'Closing', 'UrlChanged',
		'LoadStarted', 'LoadFinished', 'ResourceRequested', 'ResourceReceived', 'ResourceTimeout',
		'Alert', 'Callback', 'Confirm', 'ConsoleMessage', 'FilePicker', 'Prompt'
	], this.page, this);

}
util.inherits(Browser, EventEmitter);

/**
 * Destroy the session
 * @returns {Browser}
 */
Browser.prototype.destroy = function() {

	if (this.page) {
		this.page.close();
		this.page = null;
	}

	if (this.phantom) {
		this.phantom.exit();
		this.phantom = null;
	}

	return this;
};

//Browser.prototype.on = Browser.prototype.addListener;
Browser.prototype.off = Browser.prototype.removeListener;

/**
 * Create a browser instance
 * @param   {Object}    [options]
 * @param   {Function(Browser)}  callback
 */
Browser.create = function(options, callback) {

	//check whether the optional arguments were passed
	if (typeof(options) === 'function') {
		callback  = options;
		options   = {}
	}

	//merge the user options with the default options
	options = deepmerge(DEFAULTS, options);

	var args = [
		'--ssl-protocol='+options.ssl.protocol,
		'--ignore-ssl-errors='+options.ssl.ignore_errors,
	];

	if (options.cookies_file) {
		args.push('--cookies-file='+options.cookies_file);
	}

	debug('.create()-ing a new PhantomJS instance with args: '+args.join(' '));

	phantom.create.apply(phantom, args.concat(function(phantom) {
		phantom.createPage(function(page) {
			callback(new Browser(phantom, page, options));
		});
	}));

};

mixin(require('./browser-dom'));
mixin(require('./browser-nav'));
mixin(require('./browser-page'));

module.exports = Browser;
