var fs = require('fs');
var assert = require('assert');
var server = require('./server');
var browser = require('..');

describe('actions-page', function() {

	describe('.viewport()', function() {

		it('should successfully set the size', function(done) {

			browser()
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

			browser()
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

	describe('.wait()', function() {

		it('should wait half a second before called', function(done) {
			var start, end;

			browser()
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
					console.log('sending data');
					res.write('<head><title>Test</title></head><body><h1>Test</h1><a href="/" class="nav-link">A link!</a></body>');
					res.end();
					cb();
				}, 100);
			}, {times: 2});

			browser()
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