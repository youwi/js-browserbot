var BrowserBot = require('./../browserbot');

/**
 * Send us an email
 */

new BrowserBot()
	.go('http://www.digitaledgeit.com.au/contact/')
	.type('input[name=firstName]',  'phantom')
	.type('input[name=lastName]',   'browser')
	.type('input[name=email]',      'jameslnewell@gmail.com')
	.type('input[name=subject]',    'Phantom-Browser Test')
	.type('textarea[name=message]', 'A test message')
	.click('input[type=submit]')
	.waitForEvent('LoadFinished')
	.screenshot('contact.png')
	.html(function(html) {
		console.log('HTML: '+html);
	})
	.run(function(err) {
		console.log(err, 'done!');
	})
;
