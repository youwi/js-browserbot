var Browser = require('./../lib/browser');

var browser = new Browser();

browser.setup(function() {

	browser
		.setViewport(1024, 768)
		.go('http://www.digitaledgeit.com.au/contact/')
		.once('LoadFinished', function() {
			var count = 0;

			function then(err) {
				if (err) {
					console.log(err);
					browser.destroy();
					return;
				}
				if (++count === 5) {
					browser.click('input[type=submit]', function () {
						browser.once('LoadFinished', function () {

							browser.screenshot('contact.png');

							browser.destroy();

						});
					});

				}
			}

			browser
				.type('input[name=firstName]', 'phantom', then)
				.type('input[name=lastName]', 'browser', then)
				.type('input[name=email]', 'jameslnewell@gmail.com', then)
				.type('input[name=subject]', 'Phantom-Browser Test', then)
				.type('textarea[name=message]', 'A test message', then)
			;

		}
	);

	browser.on('ConsoleMessage', function() {
		console.log(arguments);
	});

});


