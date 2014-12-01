
module.exports = {

	zoom: function(factor) {
	},

	/**
	 * Capture a screenshot of the page
	 * @param   {String}    path      Where to save the screenshot
	 * @param   {Function}  callback
	 * @returns {BrowserBot}
	 */
	screenshot: function(path, callback) {
		this.debug('.screenshot() saved to "'+path+'"');
		this.page.render(path, {}, callback);
		return this;
	}

};