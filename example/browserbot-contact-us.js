var browserbot = require('..');

// send me an email

new browserbot()
	.go('http://www.digitaledgeit.com.au/contact/')
	.waitForPageToLoad()
	.type('input[name=firstName]',  'nodejs')
	.type('input[name=lastName]',   'expert')
	.type('input[name=email]',      'nodejs-expert@example.com')
	.type('input[name=subject]',    'BrowserBot')
	.type('textarea[name=message]', 'I really like BrowserBot, your PhantomJS wrapper!')
	.click('input[type=submit]')
	.waitForPageToLoad()
	.screenshot('contact.png')
	.run(function(err) {
		console.log(err, 'Your email has been sent and your screenshot has been saved!');
	})
;
