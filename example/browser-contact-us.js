var browser = require('./../lib/browser');

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
							console.log(status, 'Your email has been sent and your screenshot has been saved!');

						});
					});

				}
			}

			browser
				.type('input[name=firstName]',  'nodejs', then)
				.type('input[name=lastName]',   'expert', then)
				.type('input[name=email]',      'nodejs-expert@example.com', then)
				.type('input[name=subject]',    'BrowserBot', then)
				.type('textarea[name=message]', 'I really like BrowserBot, your PhantomJS wrapper!', then)
			;

		}
	);

	browser.on('ConsoleMessage', function() {
		console.log(arguments);
	});

});


