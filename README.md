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

## Usage

### Definition

Defining and raising errors manually:

```javascript
var clierr = require('cli-error');
var define = clierr.define, raise = clierr.raise, errors = clierr.errors;
define('EARGLENGTH', 'too few arguments');
if(process.argv.length < 3) {
  raise(errors.EARGLENGTH);
}
```

### Manual

If you prefer you can create errors as needed, adapted from the [manual](https://github.com/freeformsystems/cli-error/tree/master/bin/manual) example executable.

```javascript
var clierr = require('cli-error'), Error = clierr.error;
var err = new Error('fatal: %s not found', 128, ['file.json']);
// print formatted message to stderr
err.error();
// use the error exit status code 
err.exit();
```

## API

### Module

#### define(key, message, [parameters], [code])

Define an error instance by named key.

* `key`: The error key.
* `message`: The error message.
* `parameters`: Array of message replacement parameters (optional).
* `code`: Specific exit status code for the error (optional).

#### error

Reference to the `CliError` class.

#### errors

Map of defined error instances.

[ttycolor]: https://github.com/freeformsystems/ttycolor
