var assert = require('assert');
var server = require('./server');
var browser = require('../lib/browser');

describe('browser-nav', function() {

	describe('.go()', function() {

		it('should successfully make a request when I go to a valid URL', function(done) {
			var request = false;

			var srv = server(function(req, res) {
				request = true;
				res.write('<html><head><title>Test</title></head><body><h1>Test</h1></body>');
				res.end();
			});

			browser.create(function(browser) {
				browser.go(srv.url);
				browser.once('LoadFinished', function() {
					browser.destroy();

					assert(request);
					assert.equal(typeof(err), typeof(undefined));

					done();
				});
			});

		});

		it('should get an error when I go to a offline URL', function(done) {
			browser.create(function(browser) {
				browser.go('http://foobar.localhost:9999');

				browser.once('LoadFinished', function(status) {
					browser.destroy();
					assert.equal(status, 'fail');
					done();
				});
			});
		});

		it('should get an error when I go to an invalid URL', function(done) {
			browser.create(function(browser) {
				browser.go('foobar://la-de-dah/invalid');

				browser.once('LoadFinished', function(status) {
					browser.destroy();
					assert.equal(status, 'fail');
					done();
				});
			})
		});

		it('should get an error when an asset does not exist', function(done) {
			var request = false;

			var srv = server(function(req, res) {
				request = true;
				res.write('<html><head><title>Test</title></head><body><h1>Test</h1><img src="./non-existent-image.png"/></body>');
				res.end();
			});

			browser.create(function(browser) {
				browser.go(srv.url);
				browser.once('LoadFinished', function() {
					browser.destroy();

					assert(request);
					assert.equal(typeof(err), typeof(undefined));

					done();
				});
			});


		});

	});

});