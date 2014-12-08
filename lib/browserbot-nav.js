module.exports = /** @lends {BrowserBot.prototype} */{

	/**
	 * Browse to a URL
	 * @param   {String}    url
	 * @param   {Function}  [callback]
	 * @returns {BrowserBot}
	 */
	go: function(url, callback) {
		return this.queue(function(browser, done) {
			this.debug('.go()-ing to URL "'+url+'"');
			browser.go(url, function(err) {
				if (callback) {
					callback(err, done);
				} else {
					done(err);
				}
			});
		});
	},

	stop: function() {
	},

	back: function() {
	},

	forward: function() {
	},

	reload: function() {
	}

};