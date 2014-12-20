var browser = require('./../lib/browser');

var query = 'weird';

browser.create(function(browser) {

	browser
		.viewport(1024, 768)
		.go('http://www.ebay.com/')
		.once('LoadFinished', function(err) {
			if (err !== 'success') return console.log(err) || browser.destroy();

			//submit the search form
			browser.type('#gh-ac', query, function(err) {
				if (err) return console.log(err) || browser.destroy();

				browser.click('#gh-btn', function(err) {
					if (err) return console.log(err) || browser.destroy();

					browser.once('LoadFinished', function(err) {
						if (err !== 'success') return console.log(err) || browser.destroy();

						//fetch search results
						console.log('fetching search results');
						browser.screenshot('ebay.png');
						browser.evaluate(
							function() {

								var listings = document.querySelectorAll('#ListViewInner .lvresult');

								var results = [];
								for (var i=0; i<listings.length; ++i) {
									var listing = listings[i];
									console.log(listing);
									results.push({
										name:   listing.querySelector('.lvtitle').textContent.replace(/(^\s+)|(\s+$)|\r|\n|\t/, ''),
										image:  listing.querySelector('.lvpic img').src.replace(/(^\s+)|(\s+$)|\r|\n|\t/, ''),
										price:  listing.querySelector('.lvprice').textContent.replace(/(^\s+)|(\s+$)|\r|\n|\t/, '')
									});
								}

								return results;

							},
							function(err, results) {
								if (err) return console.log(err) || browser.destroy();

								console.log('Found '+results.length+' results for "'+query+'" on ebay.');
								console.log('---');

								for (var i=0; i<results.length; ++i) {
									console.log("#"+i +' '+ results[i].price +' '+ results[i].name +' '+ results[i].image)
								}

								browser.destroy();

							}
						);

					});

				});

			});

		});

	browser.on('ResourceError', function() {
		//console.log(arguments);
	});
	browser.on('Error', function() {
		console.log(arguments);
	});
	browser.on('ConsoleMessage', function() {
		console.log(arguments);
	});

});


