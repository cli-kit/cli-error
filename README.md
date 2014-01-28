# Command Line Error

Unified error handling for command line interfaces.

## About

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
* Load error definitions from locale aware json documents

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

Use `define` and `raise` to use auto-incrementing exit status codes and reference errors by identifier, adapted from the [argv](https://github.com/freeformsystems/cli-error/blob/master/bin/argv) example executable.

```
./bin/argv; echo $?;
```

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

```
./bin/manual; echo $?;
```

```javascript
var clierr = require('cli-error'), Error = clierr.error;
var err = new Error('fatal: %s not found', 128, ['file.json']);
// print formatted message to stderr
err.error();
// use the error exit status code 
err.exit();
```

## API

### Configuration

Configure the options for the module by passing an object when requiring the
module:

```javascript
var clierr = require('..')({name: 'program'});
```

* `name`: The name for the error instances, default is
  `basename(process.argv[1])`.
* `start`: A number indicating the start when auto-incrementing exit status
  codes, default `128`.
* `prefix`: A prefix for messages used when printing erros using the `console`
  methods. Maybe a boolean `true` to use `name` as the prefix (like standard
  error messages), a `string` or a `function` that returns a prefix.

### Module

#### define(key, message, [parameters], [code])

Define an error instance by named key.

* `key`: The error key.
* `message`: The error message.
* `parameters`: Array of message replacement parameters (optional).
* `code`: Specific exit status code for the error (optional).

Returns an `ErrorDefinition` instance.

#### error

Reference to the `CliError` class.

#### errors

Map of defined error instances.

#### raise(err, ...)

* `err`: A `CliError` instance.
* `...`: Message replacement parameters.

Raise an error from an error definition. If there are no defined listeners for `uncaughtException` this method will print the formatted error message, using `console.error` and exit with the status code associated with the error instance. The stack trace is not printed to `stderr`.

[ttycolor]: https://github.com/freeformsystems/ttycolor
