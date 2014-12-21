var http = require('http');
var https = require('https');

var host = 'localhost';
var port = 3100; //Apple iSync is on port 3004

/**
 * Create a server
 * @param   {Function}  fn
 * @param   {Object}    options
 * @returns {http.Server}
 */
module.exports = function(fn, options) {
	var socket;

	var server = http.createServer(function(req, res) {

		function clean() {

			if (typeof(options) !== 'undefined' && options.times > 1) {
				return --options.times;
			}

			server.close();
			socket.destroy();

		}

		//serve the request
		if (fn.length === 3) {
			fn(req, res, clean);
		} else {
			fn(req, res);
			clean();
		}

	});

	server.on('connection', function(s) {
		socket = s;
	});

	//set the server URL
	server.url ='http://'+host+':'+port;

	//start the server
	server.listen(port++);

	return server;
};
