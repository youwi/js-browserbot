# browserbot

A library for programatically browsing websites.

This library takes many ideas from [NightmareJS](https://github.com/segmentio/nightmare) with one major difference - 
errors stop remaining queued actions from executing and return an error to the user.

## Install

    npm install --save browserbot

## TODO:

 - better error handling e.g. when selectors are not found
 - add optional timeouts for wait functions
 - implement unfinished actions
 - use the same debug object