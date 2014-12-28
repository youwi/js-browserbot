# browserbot

A library for programatically browsing websites.

This library takes many ideas from [NightmareJS](https://github.com/segmentio/nightmare) with one major difference - 
errors stop the remaining queued actions from executing and return an error to the user.

## Install

    npm install --save browserbot

## Usage
    
Send me an email:
    
    var browserbot = require('browserbot');
    
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

## Plugins

Plugins are just functions whom are passed the browserbot object and perform some functionality. Normally a plugin will 
queue one or more commands.

### Examples

#### Authenticate a user by username and password

    function authenticate(username, password) {
        return function(browserbot) {
            browserbot
                .go('http://example.com/login')
                .waitForPageToLoad()
                .type('#username', username)
                .type('#password', password)
                .click('#login')
                .waitForPageToLoad()
            ;
        };
    }
    
    browserbot.use(authenticate('john.smith', 'i_love_JS!'));
    
    //now call other browserbot methods to browse authenticated pages
    
#### Disable CSS Transitions on pages that use Modernizr

    function disableCSSTransitions(browserbot) {
        browserbot.evaluate(function() {
            document.body.classList.remove('csstransitions');
        });
    }
    
    browserbot.use(disableCSSTransitions);
    
    //now call other browserbot methods to browse pages with transitions disabled

## API

### browserbot() : Browserbot

### .on()
### .once()
### .off()

### .go()
### .type()
### .click()

### .viewport(width, height)
### .screenshot(path)

### .wait(ms)
### .waitForEvent(event)
### .waitForPageToLoad()

### .run()

## TODO

 - better error messages e.g. when selectors are not found
 - add optional timeouts for wait functions
 - implement unfinished actions
 - use the same debug object
 - show resource errors
 - don't default SSL etc on
 
## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
