var fs = require('fs');
var assert = require('assert');
var server = require('./server');
var BrowserBot = require('../lib/browserbot');

describe('BrowserBot', function() {

	describe('.constructor', function() {

		it('should create a new instance', function() {
			assert(new BrowserBot());
		});

	});

	describe('.queue()', function() {

		it('should create a new instance', function() {
			assert(new BrowserBot());
		});

	});

	describe('.run()', function() {

		it('should run actions in order', function() {

			var srv = server(function(req, res) {
				res.write('<html><head><title>Test</title></head><body><h1>Test</h1><a href="/" class="nav-link">A link!</a></body>');
				res.end();
			});

			var bb = new BrowserBot();
			bb
				.go(srv.url)
				.queue(function(browserbot, done) {
					order.push(1);
					done();
				})
		});

		it('should run with a callback', function(done) {
			new BrowserBot().run(function(err) {
				done();
			});
		});

		it('should run without a callback', function() {
			new BrowserBot().run();
		});

	});

});