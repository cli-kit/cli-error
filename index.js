var util = require('util');

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
  this.name = "CliError";
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
 *  @param trace Whether to include the stack trace.
 *  @param ... Message replacement parameters.
 */
CliError.prototype.warn = function(trace) {
  var msg = this.message;
  var params = (arguments.length > 1) ? [].slice.call(arguments, 1)
    : this.parameters;
  console.dir(params);
  params.unshift(msg);
  console.warn.apply(console, params);
}

CliError.prototype.error = function(trace) {

}

/**
 *  Exit the process with the status code
 *  associated with this error.
 */
CliError.prototype.exit = function() {
  process.exit(this.code);
}

var definitions = {};

function define(key, code, message) {
  definitions[key] = new CliError(message, code);
}

module.exports = {
  error: CliError,
  definitions: definitions,
  define: define
}

var err = new CliError('a %s message', 'warn');
err.warn(true);
//throw err;
