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
                .type('#username', username)
                .type('#password', password)
                .click('#login')
                .waitForEvent('LoadFinished')
            ;
        };
    }
    
    browserbot.use(authenticate('john.smith', 'i_love_JS!'));
    
#### Disable CSS Transitions on pages the use Modernizr

    function disableCSSTransitions(browserbot) {
        browserbot.evaluate(function() {
            document.body.classList.remove('csstransitions');
        });
    }
    
    browserbot.use(disableCSSTransitions);

## TODO:

 - better error handling e.g. when selectors are not found
 - add optional timeouts for wait functions
 - implement unfinished actions
 - use the same debug object