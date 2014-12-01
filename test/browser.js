var fs = require('fs');
var assert = require('assert');
var server = require('./server');
var Browser = require('../lib/browser');

describe('Browser', function() {

	describe('.constructor', function() {

		it('should be constructable', function() {
			assert(new Browser());
		});

	});

	describe('.setup()', function() {

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