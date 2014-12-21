var fs = require('fs');
var assert = require('assert');
var server = require('./server');

var browser = require('../lib/browser');

describe('Browser', function() {

	describe('.create()', function() {

		it('should create a browser', function() {
			browser.create(function(browser) {
				browser.destroy();
			});
		});

		it('should create a browser with options', function() {
			browser.create({}, function(browser) {
				browser.destroy();
			});

		});

	});

	describe('.destroy()', function() {

		it('should be destroyed', function() {
			browser.create(function(browser) {
				browser.destroy();
			});
		});

	});

	describe('events', function() {

		it('should emit error event', function() {
		});

		it('should emit load started event', function() {
		});

		it('should emit load finished event', function() {
		});

	});

});