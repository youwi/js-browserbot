var fs = require('fs');
var assert = require('assert');
var server = require('./server');
var Browser = require('..');

describe('browser', function() {

	it('should be constructable', function() {
		var browser = new Browser();
		assert(browser);
	});

	it('should run actions in order', function() {
		var browser = new Browser();

		var srv = server(function(req, res) {
			res.write('<html><head><title>Test</title></head><body><h1>Test</h1><a href="/" class="nav-link">A link!</a></body>');
			res.end();
		});

		browser
			.go(srv.url)
			.use(function() {
				order.push(1)
			})
			.
	});

});