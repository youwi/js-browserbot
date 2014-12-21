var browserbot = require('..');

/**
 * Send us an email
 */

new browserbot()
	.go('http://www.digitaledgeit.com.au/contact/')
	.waitForPageToLoad()
	.type('input[name=firstName]',  'phantom')
	.type('input[name=lastName]',   'browser')
	.type('input[name=email]',      'tester@example.com')
	.type('input[name=subject]',    'Phantom-Browser Test')
	.type('textarea[name=message]', 'A test message')
	.click('input[type=submit]')
	.waitForPageToLoad()
	.screenshot('contact.png')
	.html(function(err, html, done) {
		console.log('HTML: '+html);
		done();
	})
	.run(function(err) {
		console.log(err, 'done!');
	})
;
