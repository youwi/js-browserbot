
module.exports = {

	/**
	 * Browse to a URL
	 * @param   {String}    url
	 * @param   {Function}  callback
	 * @returns {BrowserBot}
	 */
	go: function(url, callback) {
		this.debug('.go()-ing to URL "'+url+'"');
		this.page.open(url, function(status) {
			if (callback) callback(status === 'success' ? undefined : new Error('Failed to load "'+url+'"'));
		});
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