var assert = require('assert');
var util = require('util');
var config = {
  name: 'CliError'
}

/**
 *  An error class with support for message parameter
 *  replacement and exit status codes.
 *
 *  @param message The error message.
 *  @param code An exit status code.
 *  @param parameters Array of message replacement parameters.
 */
var CliError = function(message, code, parameters) {
  Error.call(this);
  this.name = config.name;
  this.message = message;
  this.code = code || 1;
  this.parameters = parameters || [];
  Error.captureStackTrace(this);
  var stack = this.stack.split('\n');
  // NOTE: remove constructor from stack trace
  stack.splice(1, 1);
  this.stack = stack.join('\n');
}

util.inherits(CliError, Error);


/**
 *  Print a warning message from the contents
 *  of this error.
 *
 *  @api private
 *
 *  @param method The console method.
 *  @param trace Whether to include the stack trace.
 *  @param parameters Message replacement parameters.
 */
CliError.prototype.print = function(method, trace, parameters) {
  var msg = this.message;
  parameters = parameters.length ? parameters : this.parameters;
  parameters.unshift(msg);
  method.apply(console, parameters);
}

/**
 *  Print a warning message from the contents
 *  of this error.
 *
 *  @param trace Whether to include the stack trace.
 *  @param ... Message replacement parameters.
 */
CliError.prototype.warn = function(trace) {
  this.print(console.warn, trace, [].slice.call(arguments, 1));
}

/**
 *  Print an error message from the contents
 *  of this error.
 *
 *  @param trace Whether to include the stack trace.
 *  @param ... Message replacement parameters.
 */
CliError.prototype.error = function(trace) {
  this.print(console.error, trace, [].slice.call(arguments, 1));
}

/**
 *  Exit the process with the status code
 *  associated with this error.
 */
CliError.prototype.exit = function() {
  process.exit(this.code);
}

var errors = {};

/**
 *  Define an error for the program.
 *
 *  If the exit status code is not specified it is auto
 *  incremented based on the previously defined errors.
 *
 *  @param key The error key.
 *  @param message The error message.
 *  @param parameters Array of message replacement parameters (optional).
 *  @param code Exit status code (optional).
 */
function define(key, message, parameters, code) {
  if(typeof parameters == 'number') {
    code = parameters;
    parameters = null;
  }
  if(!code) code = Object.keys(errors).length + 1;
  var err = new CliError(message, code, parameters);
  errors[key] = err;
  return err;
}

/**
 *  Raise an error by key.
 *
 *  @param key The error key.
 */
function raise(key) {
  var parameters = [].slice.call(arguments, 1);
  assert(errors[key] instanceof CliError, 'error ' + key + ' is not defined');
  // TODO: allow parameters in raise
  if(parameters.length) {

  }
  throw errors[key];
}

module.exports = function(conf) {
  config = conf;
}

module.exports.error = CliError;
module.exports.errors = errors;
module.exports.define = define;
module.exports.raise = raise;
