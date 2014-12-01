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

	describe('.wait()', function() {

		it('should wait half a second before called', function(done) {
			var start, end;

			BrowserBot()
				.queue(function(browserbot, done) {
					start = new Date()
					done();
				})
				.wait(500)
				.queue(function(browserbot, done) {
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

			var srv = server(function(req, res, done) {
				request = true;
				res.write('<html>');
				setTimeout(function() {
					res.write('<head><title>Test</title></head><body><h1>Test</h1><a href="/" class="nav-link">A link!</a></body>');
					res.end();
					done();
				}, 100);
			}, {times: 2});

			BrowserBot()
				.go(srv.url)
				.click('a.nav-link')
				.queue(function(browserbot, done) {
					start = new Date()
					done();
				})
				.waitForEvent('LoadStarted')
				//nothing else to load so this gap is really quick
				.waitForEvent('LoadFinished')
				.queue(function(browserbot, done) {
					end = new Date()
					done();
				})
				.run(function(err) {
					assert.equal(typeof(err), typeof(undefined));
					assert(end-start >= 100);
					done();
				})
			;

		});

	});


	describe('.wrap()', function() {

		it('should queue and run without a callback', function() {

			BrowserBot()
				.go('http://yahoo.com/')
				.run(done)
			;

		});

		it('should queue and run with a callback', function(done) {
			var called = true;

			BrowserBot()
				.go('http://yahoo.com/', function() {
					called = true;
				})
				.run(function(err) {
					assert(called);
					done();
				})
			;

		});

		it('should throw an error if queued with too few arguments', function() {

			BrowserBot()
				.go()
				.run(done())
			;

		});

		it('should throw an error if queued with too many arguments', function() {

			BrowserBot()
				.go('http://www.google.com/', 'GET', '?foo=bar')
				.run(done())
			;

		});


	});

});