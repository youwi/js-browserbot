var fs = require('fs');
var assert = require('assert');
var server = require('./server');
var BrowserBot = require('../browserbot');

describe('BrowserBot::Plugin', function() {

	describe('.queue()', function() {

		it('should queue', function(done) {

			BrowserBot()
				.queue(function(browserbot, done) {
					assert(browserbot instanceof BrowserBot);
					assert(typeof(done) === 'function');
					done();
				})
				.run(function(err) {
					assert.equal(typeof(err), typeof(undefined));
					done();
				})
			;

		});

	});

});