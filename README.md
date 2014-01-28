# Command Line Error

Most command line programs under-utilize the ability to use multiple non-zero
exit codes to indicate the type of error encountered, typically most programs
exit with an exit status of `1` which gives no indication of what type of
error occured.

The benefit of using multiple non-zero exit codes is that it is much easier to *programatically* determine the type of error that occured when invoking a program from another program without parsing `stderr`.

If a program documents it's exit status codes then a callee can ignore `stderr` and provide it's own indication of the type of error that occured.

This module is a set of helper functions and an error class designed to help creators of command line interfaces to structure their error handling around pre-defined error instances with different non-zero exit codes.

## Features

* Seamless integration with [ttycolor][ttycolor]
* Exit status codes associated with an `Error` instance
* Message replacement parameters at definition or runtime
* Auto-incrementing exit status codes

## Installation

```
npm install cli-error
```

## Test

```
npm test
```

## Examples

The [bin](https://github.com/freeformsystems/cli-error/tree/master/bin) directory contains example programs.

## API

```javascript
var clierr = require('cli-error');
var define = clierr.define, raise = clierr.raise, errors = clierr.errors;
// define some errors with incrementing exit codes
// and definition time replacement parameters
define('EWARN', 'a %s message', ['warn']);
define('EFATAL', 'a %s message', ['fatal']);
define('EARGLENGTH', 'too few arguments');
if(process.argv.length < 3) {
  raise(errors.EARGLENGTH);
}
```

[ttycolor]: https://github.com/freeformsystems/ttycolor
