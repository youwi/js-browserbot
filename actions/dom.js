var debug = require('debug')('browser');

/**
 * Evaluate an expression on the current page and pass the result to a callback
 * @param {Object}    browser
 * @param {Function}  fn
 * @param {Array}     [args]
 * @param {Function}  cb
 * @param {Function}  done
 */
function evaluate(browser, fn, args, cb, done) {
	var error;

	//allow optional fn arguments
	if (arguments.length === 4) {
		done  = cb;
		cb    = args;
		args  = undefined;
	}

	//capture any errors
	browser.page.set('onError', function(message, trace) {
		error = {message: message, trace: trace};
	});

	browser.page.evaluate.apply(browser.page, [
		fn,
		function(result) {

			if (!error) {
				browser.page.set('onError', undefined);
				cb(result);
			}

			done(error);
		}
	].concat(args));
}

module.exports = {

	/**
	 * Evaluate an expression on the current page and pass the result to a callback
	 * @param {Function}  fn
	 * @param {Function}  cb
	 * @param {Function}  done
	 */
	evaluate: function(fn, cb, done) {
		evaluate(this, fn, cb, done);
	},

	/**
	 * Get the page URL
	 * @param {Function}  cb
	 * @param {Function}  done
	 */
	url: function(cb, done) {
		debug('.url()');
		evaluate(this, function() { return window.location.href; }, cb, done);
	},

	/**
	 * Get the page title
	 * @param {Function}  cb
	 * @param {Function}  done
	 */
	title: function(cb, done) {
		debug('.title()');
		evaluate(this, function() { return document.title; }, cb, done);
	},

	exists: function(selector) {
	},

	visible: function(selector) {
	},

	/**
	 * Click on an element
	 * @param {String}    selector
	 * @param {Function}  done
	 */
	click: function(selector, done) {
		debug('.click()-ing` "%s"', selector);
		var self = this;

		function click(selector) {

			var ev = document.createEvent('MouseEvent');
			ev.initEvent('click', true, true);

			var el = document.querySelector(selector);
			el.dispatchEvent(ev);

		}

		function cb() {
		}

		evaluate(this, click, [selector], cb, done);
	},

	/**
	 * Type on an element
	 * @param {String}    selector
	 * @param {String}    text
	 * @param {Function}  done
	 */
	type: function(selector, text, done) {
		debug('.type()-ing "%s" into "%s"', text, selector);
		var self = this;

		function focus(selector) {
			document.querySelector(selector).focus();
		}

		function cb() {
			self.page.sendEvent('keypress', text, null, null, 0);
		}

		evaluate(this, focus, [selector], cb, done);
	},

	/**
	 * Get the document source
	 * @param {Function}  cb
	 * @param {Function}  done
	 */
	html: function(cb, done) {
		debug('.html()');
		evaluate(this, function() { return document.documentElement.outerHTML; }, cb, done);
	},

};