# browserbot

A library for programatically browsing websites.

This library takes many ideas from [NightmareJS](https://github.com/segmentio/nightmare) with one major difference - 
errors stop remaining queued actions from executing and return an error to the user.

## Install

    npm install --save browserbot

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
    
#### Disable CSS Transitions on pages that use Modernizr

    function disableCSSTransitions(browserbot) {
        browserbot.evaluate(function() {
            document.body.classList.remove('csstransitions');
        });
    }
    
    browserbot.use(disableCSSTransitions);

## TODO:

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
