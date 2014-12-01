var fs = require('fs');
var assert = require('assert');
var server = require('./server');
var BrowserBot = require('../browserbot');

describe('browser-page', function() {

	describe('.viewport()', function() {

		it('should successfully set the size', function(done) {

			BrowserBot()
				.viewport(1024, 768)//TODO: verify it gets created the right size
				.run(function(err) {
					assert.equal(typeof(err), typeof(undefined));
					done();
				})
			;

		});

	});

	describe('.screenshot()', function() {

		it('should create a file', function(done) {

			var file = './test.png';

			var srv = server(function(req, res) {
				res.write('<html><head><title>Test</title></head><body><h1>Test</h1></body>');
				res.end();
			});

			BrowserBot()
				.go(srv.url)
				.screenshot(file)
				.run(function(err) {
					assert.equal(typeof(err), typeof(undefined));
					assert(fs.statSync(file).isFile());
					fs.unlinkSync(file);
					done();
				})
			;

		});

	});

});