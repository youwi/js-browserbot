module.exports = /** @lends {BrowserBot.prototype} */{

	/**
	 * Set the user agent
	 * @param   {String}    useragent   Where to save the screenshot
	 * @param   {Function}  [callback]
	 * @returns {BrowserBot}
	 */
	useragent: function(useragent, callback) {
		return this.queue(function(browser, done) {
			browser.useragent(useragent);
			done();
		});
	},

	/**
	 * Set the viewport width
	 * @param   {Number} width
	 * @param   {Number} height
	 * @returns {BrowserBot}
	 */
	viewport: function(width, height) {
		this.queue(function(browser, done) {
			browser.viewport(width, height);
			setTimeout(done, 0);
		});
		return this;
	},

	/**
	 * Save a screenshot of the page
	 * @param   {String}    path        Where to save the screenshot
	 * @param   {Function}  [callback]
	 * @returns {BrowserBot}
	 */
	screenshot: function(path, callback) {
		return this.queue(function(browser, done) {
			browser.screenshot(path, function(err) {
				if (callback) {
					callback(err, done);
				} else {
					done(err);
				}
			});
		});
	}

};