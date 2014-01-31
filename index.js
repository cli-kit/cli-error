var assert = require('assert');
var path = require('path'),
  basename = path.basename,
  dirname = path.dirname;
var config = {
  name: basename(process.argv[1]),
  start: 128,
  prefix: true,
  lang: 'en',
  pad: '  ',
  locales: path.join(path.normalize(dirname(process.argv[1])), 'locales'),
  lc: ['LC_ALL', 'LC_MESSAGES']
}

var errors = {};
var ErrorDefinition = require('./lib/definition');
var CliError = require('./lib/error')(config).Error;
var lc = require('cli-locale');

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
    process.on('uncaughtException', function(e) {
      parameters.unshift(false);
      e.error.apply(e, parameters);
      e.exit();
    });
  }else{
    e.message = e.format.apply(e, parameters);
  }
  throw e;
}

/**
 *  Print a warning from an error definition.
 *
 *  @param err The error definition.
 *  @param trace Whether to include the stack trace.
 *  @param ... Message replacement parameters.
 */
function warn(err, trace) {
  assert((err instanceof ErrorDefinition),
    'argument to warn must be error definition');
  var e = err.toError();
  // remove this method from the stack trace
  e.stacktrace.shift();
  var parameters = [].slice.call(arguments, 2);
  parameters.unshift(trace);
  e.warn.apply(e, parameters);
  return e;
}


/**
 *  Exit the program from an error definition.
 *
 *  @param err The error definition.
 *  @param trace Whether to include the stack trace.
 *  @param ... Message replacement parameters.
 */
function exit(err, trace) {
  assert(err instanceof ErrorDefinition,
    'argument to exit must be error definition');
  var e = err.toError();
  // remove this method from the stack trace
  e.stacktrace.shift();
  var parameters = [].slice.call(arguments, 2);
  parameters.unshift(trace);
  e.error.apply(e, parameters);
  e.exit();
}

/**
 *  Import definitions from an object.
 *
 *  @param source An array defining error messages.
 */
function load(source) {
  assert(Array.isArray(source), 'argument to load must be an array');
  var i, v, d;
  for(i = 0;i < source.length;i++) {
    v = source[i];
    assert(typeof v.key == 'string', 'error definition must have string key')
    d = define(v.key, v.message, v.parameters, v.code);
    if(v.description) d.description = v.description;
  }
}

/**
 *  Clear all defined errors.
 */
function clear() {
  module.exports.errors = errors = {};
  return errors;
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
  if(!code && errors[key] && errors[key].code) {
    code = errors[key].code;
  }
  if(!code) code = Object.keys(errors).length + start;
  // re-use error code if overwriting
  var err = new ErrorDefinition(key, message, code, parameters);
  errors[key] = err;
  return err;
}

var file = require('./lib/file')(config, errors, load).file;

module.exports = function configure(conf) {
  for(var z in conf) {
    config[z] = conf[z];
  }
  lc.language = config.lang;
  return module.exports;
}

module.exports.clear = clear;
module.exports.config = config;
module.exports.define = define;
module.exports.ErrorDefinition = ErrorDefinition;
module.exports.CliError = CliError;
module.exports.errors = errors;
module.exports.exit = exit;
module.exports.file = file;
module.exports.load = load;
module.exports.raise = raise;
module.exports.warn = warn;
