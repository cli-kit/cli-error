var assert = require('assert');
var util = require('util');
var config = {
  name: 'CliError',
  start: 128,
  prefix: true
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
  var msg = this.message;
  if(config.prefix === true) {
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
 *  Get an array of the stack trace.
 */
CliError.prototype.getStack = function() {
  if(this.stacktrace) return this.stacktrace;
  var lines = this.stack.split('\n'), i;
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
CliError.prototype.json = function(trace) {
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

var errors = {};

var ErrorDefinition = function(key, message, code, parameters) {
  this.key = key;
  this.message = message;
  this.code = code;
  this.parameters = parameters;
}

ErrorDefinition.prototype.toError = function() {
  var err = new CliError(this.message, this.code, this.parameters);
  err.key = this.key;
  err.stacktrace.shift();
  return err;
}

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
  var start = typeof config.start == 'number' ? config.start : 128;
  if(!code) code = Object.keys(errors).length + start;
  //var err = {message: message, key: key, code: code, parameters: parameters};
  //var err = new CliError(message, code, parameters);
  //err.key = key;
  var err = new ErrorDefinition(key, message, code, parameters);
  errors[key] = err;
  return err;
}

/**
 *  Raise an error.
 *
 *  @param err The error definition.
 *  @param ... Message replacement parameters.
 */
function raise(err) {
  var parameters = [].slice.call(arguments, 1);
  assert(err instanceof ErrorDefinition,
    'argument to raise must be error definition');
  var e = err.toError();
  var listeners = process.listeners('uncaughtException');
  if(!listeners.length) {
    process.on('uncaughtException', function(err) {
      //console.error(err.toString.apply(err, parameters));
      parameters.unshift(false);
      err.error.apply(err, parameters);
      err.exit();
    });
  }
  throw e;
}

/**
 *  Exit the program with an error definition.
 *
 *  @param err The error definition.
 */
function exit(err) {
  assert(err instanceof ErrorDefinition,
    'argument to exit must be error definition');
  var e = err.toError();
  e.exit();
}

module.exports = function configure(conf) {
  for(var z in conf) {
    config[z] = conf[z];
  }
  return module.exports;
}

module.exports.error = CliError;
module.exports.errors = errors;
module.exports.define = define;
module.exports.raise = raise;
module.exports.exit = exit;
