var debug = require('debug')('browser');

module.exports = {

	/**
	 * Browse to a URL
	 * @param   {String}    url
	 * @param   {Function}  done
	 */
	go: function(url, done) {
		debug('.go()-ing to URL "'+url+'"');
		this.page.open(url, function(status) {
			done(status === 'success' ? undefined : new Error('Failed to load "'+url+'"'));
		});
	},

	stop: function() {
	},

	back: function() {
	},

	forward: function() {
	},

	reload: function() {
	},

};