var assert = require('assert');
var BrowserBot = require('../browserbot');

describe('BrowserBot plugins', function() {

	describe('.use()', function() {

		it('should be called with an instance of the object', function(done) {

			BrowserBot()
				.use(function(browserbot) {
					assert(browserbot instanceof BrowserBot);
				})
				.run(function(err) {
					assert.equal(typeof(err), typeof(undefined));
					done();
				})
			;

		});

	});

});