var assert      = require('assert');
var browserbot  = require('..');

describe('BrowserBot - Navigation', function() {

	describe('.go()', function() {

		it('should start navigating to the URL', function(done) {

			browserbot()
				.go('http://www.google.com/')
				.run(function(err) {
					assert.equal(typeof(undefined), typeof(err));
					done();
				})
			;

		});

		it('should start navigating to the URL and call the callback', function(done) {
			var called = false;

			browserbot()
				.go('http://www.google.com/', function(err, done) {
					called = true;
					done(err);
				})
				.run(function(err) {
					assert.equal(typeof(undefined), typeof(err));
					assert.equal(true, called);
					done();
				})
			;

		});

		it('should start navigating to the URL, call the callback and return an error', function(done) {

			browserbot()
				.go('http://www.google.com/', function(err, done) {
					done(new Error('SHORT-CIRCUITED BY CALLBACK'))
				})
				.run(function(err) {
					assert(err instanceof Error);
					assert.equal(err.message, 'SHORT-CIRCUITED BY CALLBACK');
					done();
				})
			;

		});

		it('should finish navigating to the URL', function(done) {
			this.timeout(6000);

			browserbot()
				.go('http://www.google.com/')
				.waitForPageToLoad()
				.run(function(err) {
					assert.equal(typeof(undefined), typeof(err));
					done();
				})
			;

		});

	});

});