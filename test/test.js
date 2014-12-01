var BB = require('../browserbot');

var bb = new BB()
bb.go('https://wwccheck.ccyp.nsw.gov.au/Employers/Search').screenshot('test.png').run();