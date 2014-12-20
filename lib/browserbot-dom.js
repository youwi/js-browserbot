module.exports = /** @lends {BrowserBot.prototype} */{

	/**
	 * Evaluate an expression on the current page and pass the result to a callback
	 * @param   {Function}  fn          An expression to setup on the current page
	 * @param   {Array<*>}  [args]      Arguments to pass the expression when setup on the current page
	 * @param   {Function}  [callback]  A callback to receive the expression result
	 * @returns {BrowserBot}
	 */
	evaluate: function(fn, args, callback) {
		var cargs = arguments.length;

		//figure out which arguments were passed
		if (cargs < 3 && !(args instanceof Array)) {
			callback  = args;
			args      = [];
		}

		return this.queue(function(browser, done) {
			this.debug('.evaluating()');

			var params    = [];
			var finished  = function(err, result) {

				if (callback) {
					callback(err, result);//should be able to be both async and sync
					done();
				} else {
					done(err);
				}
			};

			switch (cargs) {
				case 3:
					params.push(fn);
					params.push(args);
					params.push(finished);
					break;

				case 2:
					params.push(fn);
					params.push(finished);
					break;

				case 1:
					params.push(fn);
					break;

			}

			browser.evaluate.apply(browser, params);
		});
	},

	/**
	 * Get the page source
	 * @param   {Function}  [callback]
	 * @returns {BrowserBot}
	 */
	html: function(callback) {
		return this.queue(function(browser, done) {
			this.debug('.html()');
			browser.html(function(err, result) {
				if (callback) {
					callback(err, result, done);
				} else {
					done(err);
				}
			});
		});
	},

	/**
	 * Click an element
	 * @param   {String}    selector
	 * @param   {Function}  [callback]
	 * @returns {BrowserBot}
	 */
	click: function(selector, callback) {
		return this.queue(function(browser, done) {
			this.debug('.click()-ing` "%s"', selector);
			browser.click(selector, function(err) {
				if (callback) {
					callback(err, done);
				} else {
					done(err);
				}
			});
		});
	},

	/**
	 * Type on an element
	 * @param   {String}    selector
	 * @param   {String}    text
	 * @param   {Function}  [callback]
	 * @returns {Browser}
	 */
	type: function(selector, text, callback) {
		return this.queue(function(browser, done) {
			this.debug('.type()-ing "%s" into "%s"', text, selector);
			browser.type(selector, text, function(err) {
				if (callback) {
					callback(err, done);
				} else {
					done(err);
				}
			});
		});
	}

};