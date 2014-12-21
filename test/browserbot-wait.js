var assert      = require('assert');
var server      = require('./server');
var browserbot  = require('..');

describe('BrowserBot', function() {

	describe('Wait', function() {

		describe('.wait()', function() {

			it('should pause for 250ms', function(done) {
				var start, stop;

				browserbot()
					.queue(function(browser, done) {
						start = new Date();
						done();
					})
					.wait(250)
					.queue(function(browser, done) {
						stop = new Date();
						done();
					})
					.run(function(err) {
						assert(stop-start >= 250);
						done();
					})
				;

			});

			it('when I pass a callback it should pause for 250ms', function(done) {
				var start, stop, called;

				browserbot()
					.queue(function(browser, done) {
						start = new Date();
						done();
					})
					.wait(250, function(err, done) {
						called = true;
						done(err);
					})
					.queue(function(browser, done) {
						stop = new Date();
						done();
					})
					.run(function(err) {
						assert(stop-start >= 250);
						assert(called);
						done();
					})
				;

			});

			it('when I pass a callback it should pause for 250ms and then stop with an error', function(done) {
				var start, stop, called;

				browserbot()
					.queue(function(browser, done) {
						start = new Date();
						done();
					})
					.wait(250, function(err, done) {
						stop = new Date();
						done(new Error('The .wait() callback errored.'));
					})
					.queue(function(browser, done) {
						called = true;
						done();
					})
					.run(function(err) {
						assert(err instanceof Error);
						assert.equal(err.message, 'The .wait() callback errored.');
						assert(stop-start >= 250);
						assert(!called);
						done();
					})
				;

			});

		});

		describe('.waitForEvent()', function() {

			it('should wait for page to load', function(done) {
				var start, stop;

				var srv = server(function(req, res, done) {
					res.write('<html>');
					setTimeout(function() {
						res.write('<head><title>Test</title></head><body><h1>Test</h1><a href="/" class="nav-link">A link!</a></body></html>');
						res.end();
						done();
					},100);
				}, {times: 2});

				browserbot()
					.go(srv.url)
					.waitForPageToLoad()
					.click('a.nav-link')
					.queue(function(browser, done) {
						start = new Date();
						done();
					})
					.waitForEvent('LoadStarted') //TODO: check for error
					.waitForEvent('LoadFinished') //TODO: check for error
					.queue(function(browser, done) {
						stop = new Date();
						done();
					})
					.run(function(err) {
						assert.equal(typeof(undefined), typeof(err), err);
						assert(stop.getTime()-start.getTime() >= 100);
						done();
					})
				;

			});

		});

	});

});