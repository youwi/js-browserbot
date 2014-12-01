var fs = require('fs');
var assert = require('assert');
var server = require('./server');
var BrowserBot = require('../browserbot');

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
				.use(function() {
					order.push(1)
				})
		});

	});

	describe('.wait()', function() {

		it('should wait half a second before called', function(done) {
			var start, end;

			BrowserBot()
				.use(function(done) {
					start = new Date()
					done();
				})
				.wait(500)
				.use(function(done) {
					end = new Date()
					done();
				})
				.run(function(err) {
					assert.equal(typeof(err), typeof(undefined));
					assert(end-start >= 500);
					done();
				})
			;

		});

	});

	describe('.waitForEvent()', function() {

		it('should wait for page to load', function(done) {
			var start, end;

			var srv = server(function(req, res, cb) {
				request = true;
				res.write('<html>');
				setTimeout(function() {
					res.write('<head><title>Test</title></head><body><h1>Test</h1><a href="/" class="nav-link">A link!</a></body>');
					res.end();
					cb();
				}, 100);
			}, {times: 2});

			BrowserBot()
				.go(srv.url)
				.click('a.nav-link')
				.use(function(cb) {
					start = new Date()
					cb();
				})
				.waitForEvent('LoadStarted')
				//nothing else to load so this gap is really quick
				.waitForEvent('LoadFinished')
				.use(function(cb) {
					end = new Date()
					cb();
				})
				.run(function(err) {
					assert.equal(typeof(err), typeof(undefined));
					assert(end-start >= 100);
					done();
				})
			;

		});

	});
});