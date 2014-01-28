var assert = require('assert');
var revert = require('ttycolor')().defaults();
var clierr = require('..');
var define = clierr.define, errors = clierr.errors, error = clierr.error;

var warn = define('EWARN', 'a %s message', ['warn']);
var fatal = define('EFATAL', 'a %s message', ['fatal']);

console.dir(errors);

assert(warn instanceof error, 'error is of wrong type');
assert(warn.message == 'a %s message', 'error message is wrong');
assert(warn.code == 128, 'warn error code is wrong');
assert(warn.parameters.length == 1, 'warn parameters length is wrong');


assert(fatal.code == 129, 'fatal error code is wrong');

assert(Object.keys(errors).length == 2, 'wrong number of errors');

warn.warn();
fatal.error();
