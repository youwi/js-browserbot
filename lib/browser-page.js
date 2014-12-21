
module.exports = /** @lends {Browser.prototype} */{

	/**
	 * Set the user agent
	 * @param   {String} useragent
	 * @returns {Browser}
	 */
	viewport: function(useragent) {
		this.page.set('settings.userAgent', useragent);
		return this;
	},

	/**
	 * Set the viewport dimensions
	 * @param   {Number} width
	 * @param   {Number} height
	 * @returns {Browser}
	 */
	viewport: function(width, height) {
		this.page.setViewportSize(width, height);
		return this;
	},

	zoom: function(factor) {
	},

	/**
	 * Capture a screenshot of the page
	 * @param   {String}    path      Where to save the screenshot
	 * @param   {Function}  callback
	 * @returns {Browser}
	 */
	screenshot: function(path, callback) {
		this.page.render(path, {}, callback);
		return this;
	}

};