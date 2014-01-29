var util = require('util'), config;

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
  //console.dir(Error.prepareStackTrace());
  Error.captureStackTrace(this);
  var stack = this.stack.split('\n');
  // NOTE: remove constructor from stack trace
  stack.splice(1, 1);
  this.stack = stack.join('\n');
  this.stacktrace = this.getStack();
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
  var msg = this.message, prefix = config.prefix;
  if(prefix === true) {
    msg = this.name + ': ' + msg;
  }else if(typeof prefix == 'string') {
    msg = prefix + msg;
  }else if(typeof prefix == 'function') {
    msg = prefix() + msg;
  }
  parameters = parameters.length ? parameters : this.parameters;
  parameters.unshift(msg);
  method.apply(console, parameters);
}

/**
 *  Print the stack strace.
 *
 *  @api private
 *
 *  @param method The console method to invoke.
 */
CliError.prototype.printstack = function(method) {
  for(var i = 0;i < this.stacktrace.length;i++) {
    method(config.pad + this.stacktrace[i]);
  }
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
  if(trace) {
    this.printstack(console.warn);
  }
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
  if(trace) {
    this.printstack(console.error);
  }
}

/**
 *  Get an array of the stack trace.
 */
CliError.prototype.getStack = function() {
  if(this.stacktrace) return this.stacktrace;
  var lines = this.stack.split('\n'), i;
  // remove CliError constructor
  lines.shift();
  for(i = 0;i < lines.length;i++) {
    lines[i] = lines[i].trim();
  }
  return lines;
}

/**
 *  Retrieve an object suitable for JSON serialization.
 *
 *  @param trace Whether to include the stack trace.
 *  @param ... Message replacement parameters.
 */
CliError.prototype.toObject = function(trace) {
  var o = {};
  var stack = this.getStack();
  var msg = this.message;
  var parameters = [].slice.call(arguments, 1);
  if(!parameters.length && this.parameters.length) {
    parameters = this.parameters;
  }
  if(parameters.length) {
    parameters.unshift(msg);
    msg = util.format.apply(util, parameters);
  }
  o.message = msg;
  o.name = this.name;
  o.code = this.code;
  if(this.key) {
    o.key = this.key;
  }
  if(trace) {
    o.stack = stack;
  }
  return o;
}

/**
 *  Exit the process with the status code
 *  associated with this error.
 */
CliError.prototype.exit = function() {
  process.exit(this.code);
}

module.exports = function(conf) {
  config = conf;
  return module.exports;
}

module.exports.Error = CliError;
