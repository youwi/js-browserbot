var debug = require('debug')('browser');

module.exports = {

	viewport: function(width, height, done) {
		debug('.viewport() set to '+width+'x'+height)
		this.page.set('viewportSize', { width: width, height: height });
		done();
	},

	zoom: function(factor) {
	},

	/**
	 * Capture a screenshot of the page
	 * @param   {Function}  done
	 */
	screenshot: function(path, done) {
		debug('.screenshot() saved to "'+path+'"');
		this.page.render(path, {}, done);
	},

	/**
	 * Wait for a number of milliseconds to pass
	 * @param   {Number}    ms
	 * @param   {Function}  done
	 */
	wait: function(ms, done) {
		return setTimeout(done, ms);
	},

	/**
	 * Wait for an event to fire
	 * @param   {String}    event
	 * @param   {Function}  done
	 */
	waitForEvent: function(event, done) {
		debug('waiting for event "'+event+'"');

		this.on(event, function() {
			done();
		});

	},

	/**
	 * Wait for an element to be present on the page
	 * @param   {String}    selector
	 * @param   {Function}  done
	 */
	waitForElement: function(event, done) {

	},


};