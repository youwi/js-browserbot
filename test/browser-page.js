var fs = require('fs');
var assert = require('assert');
var server = require('./server');

var browser = require('../lib/browser');

describe('browser-page', function() {

	describe('.viewport()', function() {

		it('should successfully set the size', function(done) {

			browser.create(function(browser) {
				browser.viewport(1024, 768); //TODO: verify it gets created the right size

				browser.destroy();
				done();
			});

		});

	});

	describe('.screenshot()', function() {

		it('should create a file', function(done) {

			var file = './test.png';

			var srv = server(function(req, res) {
				res.write('<html><head><title>Test</title></head><body><h1>Test</h1></body>');
				res.end();
			});

			browser.create(function(browser) {
				browser.go(srv.url);
				browser.once('LoadFinished', function() {
					browser.screenshot(file);
					assert(fs.existsSync(file));
					assert(fs.statSync(file).isFile());
					fs.unlinkSync(file);
					browser.destroy();
					done();
				});
			});

		});

	});

});