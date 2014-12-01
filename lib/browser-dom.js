module.exports = {

	/**
	 * Evaluate an expression on the current page and pass the result to a callback
	 * @param   {Function}  fn        An expression to setup on the current page
	 * @param   {Array<*>}  [args]    Arguments to pass the expression when setup on the current page
	 * @param   {Function}  callback  A callback to recieve the expression result
	 * @returns {BrowserBot}
	 */
	evaluate: function(fn, args, callback) {
		var err, self = this;

		if (this.evaluating > 0) {
			++this.evaluating;
			this.debug('You shouldn\'t run two .evaluate() methods asynchronously - if there is an error we won\'t know which method the error was caused by and both methods will return an error');
		} else {
			this.evaluating = 1;
		}

		//figure out which arguments were passed
		if (arguments.length < 3) {
			callback  = args || function() {};
			args      = [];
		}

		//capture the error if there is one
		function captureError(error) {
			err = error;
		}
		this.once('Error', captureError);

		//remove the error handler and call the callback with the error
		function finished(result) {
			--self.evaluating;
			self.off('Error', captureError);
			if (callback) callback(err, result);
		}

		//evaluate the expression
		this.page.evaluate.apply(this.page, [fn, finished].concat(args));

		return this;
	},

	/**
	 * Get the page URL
	 * @param   {Function}  callback
	 * @returns {BrowserBot}
	 */
	url: function(callback) {
		this.debug('.url()');
		return this.evaluate(function() { return window.location.href; }, callback);
	},

	/**
	 * Get the page title
	 * @param   {Function}  callback
	 * @returns {BrowserBot}
	 */
	title: function(callback) {
		this.debug('.title()');
		return this.evaluate(function() { return document.title; }, callback);
	},

	/**
	 * Get whether an element exists
	 * @param   {String} selector
	 * @returns {BrowserBot}
	 */
	exists: function(selector) {
		this.debug('.exists()');
		return this.evaluate(function(selector) { return document.querySelector(selector) !== null; }, [selector], callback);
	},

	visible: function(selector) {
	},

	/**
	 * Click an element
	 * @param   {String}    selector
	 * @param   {Function}  callback
	 * @returns {BrowserBot}
	 */
	click: function(selector, callback) {
		this.debug('.click()-ing` "%s"', selector);
		var self = this;

		//fire the click event on the element
		function click(selector) {

			var ev = document.createEvent('MouseEvent');
			ev.initEvent('click', true, true);

			var el = document.querySelector(selector);
			el.dispatchEvent(ev);

		}

		return this.evaluate(click, [selector], callback);
	},

	/**
	 * Type on an element
	 * @param   {String}    selector
	 * @param   {Function}  callback
	 * @returns {BrowserBot}
	 */
	type: function(selector, text, callback) {
		this.debug('.type()-ing "%s" into "%s"', text, selector);
		var self = this;

		//focus the element/input so we can type text on it
		function focus(selector, text) {

			var el = document.querySelector(selector);

			if (el.nodeName === 'INPUT') {
				el.value = text;
			} else {
				el.textContent = text;
			}

		}

		return this.evaluate(focus, [selector, text], function(err) {
			if (err) return callback(err);
			//self.page.sendEvent('keypress', text, null, null, 0);
			if (callback) callback();
		});
	},

	/**
	 * Get the document source
	 * @param   {Function}  callback
	 * @returns {BrowserBot}
	 */
	html: function(callback) {
		this.debug('.html()');
		return this.evaluate(function() { return document.documentElement.outerHTML; }, callback);
	}

}