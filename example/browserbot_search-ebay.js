var browserbot = require('../browserbot');

var browser = browserbot({ssl: {ignore_errors: true}});

var query = 'phantom';

browser
	.viewport(1024, 768)
	.go('http://www.ebay.com/')
	.waitForPageToLoad()
	.type('#gh-ac', query)
	.click('#gh-btn')
	.waitForPageToLoad()
	.screenshot('ebay.png')
	.evaluate(
		function() {

			var listings = document.querySelectorAll('#ListViewInner .lvresult');

			var results = [];
			for (var i=0; i<listings.length; ++i) {
				var listing = listings[i];
				results.push({
					name:   listing.querySelector('.lvtitle').textContent.replace(/(^\s+)|(\s+$)|\r|\n|\t/, ''),
					image:  listing.querySelector('.lvpic img').src.replace(/(^\s+)|(\s+$)|\r|\n|\t/, ''),
					price:  listing.querySelector('.lvprice').textContent.replace(/(^\s+)|(\s+$)|\r|\n|\t/, '')
				});
			}

			return results;

		},
		function(err, results) {
			console.log('results', results);
			if (err) return console.log(err);

			console.log('Found '+results.length+' results for "'+query+'" on ebay.');
			console.log('---');

			for (var i=0; i<results.length; ++i) {
				console.log("#"+i +' '+ results[i].price +' '+ results[i].name +' '+ results[i].image)
			}

		}
	)
	.run(function(err) {
		console.log(err, 'done!');
	})
;

browser.on('Error', function() {
	console.log('Error', arguments);
})
browser.on('ResourceError', function() {
	console.log('ResourceError', arguments);
})

browser.on('ConsoleMessage', function() {
	console.log('ConsoleMessage', arguments);
})
