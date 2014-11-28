var assert = require('assert');
var server = require('./server');
var browser = require('..');

describe('actions-page', function() {

	describe('.go()', function() {

		it('should successfully make a request when I go to a valid URL', function(done) {
			var request = false;

			var srv = server(function(req, res) {
				request = true;
				res.write('<html><head><title>Test</title></head><body><h1>Test</h1></body>');
				res.end();
			});

			browser()
				.go(srv.url)
				.run(function(err) {
					assert(request);
					assert.equal(typeof(err), typeof(undefined));
					done();
				})
			;

		});

		it('should get an error when I go to a offline URL', function(done) {
			browser()
				.go('http://foobar.localhost:9999')
				.run(function(err) {
					assert(err instanceof Error);
					done();
				})
			;
		});

		it('should get an error when I go to an invalid URL', function(done) {
			browser()
				.go('foobar://la-de-dah/invalid')
				.run(function(err) {
					assert(err instanceof Error);
					done();
				})
			;
		});

	});

});