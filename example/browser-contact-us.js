var browser = require('./../lib/browser');

var query = 'weird';

browser.create(function(browser) {

	browser
		.viewport(1024, 768)
		.go('http://www.digitaledgeit.com.au/contact/')
		.once('LoadFinished', function(status) {
			var count = 0;

			function then(err) {
				if (err) return console.log(err) || browser.destroy();

				if (++count === 5) {
					browser.click('input[type=submit]', function () {
						browser.once('LoadFinished', function(status) {

							browser.screenshot('contact.png');
							browser.destroy();
							console.log('done');

						});
					});

				}
			}

			browser
				.type('input[name=firstName]', 'phantom', then)
				.type('input[name=lastName]', 'browser', then)
				.type('input[name=email]', 'tester@example.com', then)
				.type('input[name=subject]', 'Phantom-Browser Test', then)
				.type('textarea[name=message]', 'A test message', then)
			;

		}
	);

	browser.on('ConsoleMessage', function() {
		console.log(arguments);
	});

});


