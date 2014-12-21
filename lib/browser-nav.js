
module.exports = /** @lends {browser.prototype} */{

	/**
	 * Browse to a URL
	 *  - listen for LoadFinished
	 * @param   {String}    url
	 * @param   {Function}  [callback]  Called almost immediately after
	 * @returns {browser}
	 */
	go: function(url, callback) {
		this.page.open(url);
		if (callback) setTimeout(function() {callback();}, 0);
		return this;
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