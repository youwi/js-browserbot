var assert = require('assert');
var server = require('./server');
var browser = require('../lib/browser');

describe('browser-nav', function() {

	describe('.go()', function() {

		it('should successfully make a request when I go to a valid URL', function(done) {
			var requested = false;

			var srv = server(function(req, res) {
				requested = true;
				res.write('<html><head><title>Test</title></head><body><h1>Test</h1></body>');
				res.end();
			});

			browser.create(function(browser) {

				browser.on('LoadFinished', function(err) {
					assert.equal('success', err);

					assert(requested);

					browser.destroy();
					done();
				});

				browser.go(srv.url, function(err) {
					assert(!err);
				});

			});

		});

		it('should get an error when I go to a offline URL', function(done) {
			browser.create(function(browser) {
				browser.go('http://foobar.localhost:9999', function(err) {
					assert.notEqual('success', err);
					browser.destroy();
					done();
				});
			});
		});

		it('should get an error when I go to an invalid URL', function(done) {
			browser.create(function(browser) {
				browser.go('foobar://la-de-dah/invalid', function(err) {
					assert.notEqual('success', err);
					browser.destroy();
					done();
				});
			})
		});

	});

});