//TODO: allow the user to specify a callback (to access the event data) and timeout

module.exports = /** @lends {BrowserBot.prototype} */{

	/**
	 * Wait for the given amount of time
	 * @param   {Number}    ms
	 * @param   {Function}  [callback]
	 * @returns {BrowserBot}
	 */
	wait: function(ms, callback) {
		return this.queue(function(browser, done) {
			setTimeout(function(err) {
				if (callback) {
					callback(err, done);
				} else {
					done(err);
				}
			}, ms);
		});
	},

	/**
	 * Wait for a condition to turn true
	 * @param   {Function} fn
	 * @returns {BrowserBot}
	 */
	waitFor: function(fn) {
		throw new Error('Not implemented yet.');
		return this;
	},

	/**
	 * Wait for an event to be emitted
	 * @param   {String} event
	 * @returns {BrowserBot}
	 */
	waitForEvent: function(event) {
		return this.queue(function(browser, done) {
			this.debug('.waitForEvent() "'+event+'"');
			browser.once(event, function() {
				done();
			});
		});
	},

	/**
	 * Wait for the `LoadFinished` event to be emitted
	 * @param   {Function}  [callback]
	 * @returns {BrowserBot}
	 */
	waitForPageToLoad: function(callback) {
		return this.queue(function(browser, done) {
			this.debug('.waitForPageToLoad()');
			browser.once('LoadFinished', function(status) {

				var err = status === 'success' ? undefined : new Error('Errors occurred whilst waiting for the page to load.');

				if (callback) {
					callback(err, done);
				} else {
					done(err);
				}

			});
		});
	},

	waitForElement: function(selector) { //TODO: allow the user to specify a timeout
		throw new Error('Not implemented yet.');
		return this;
	}

};