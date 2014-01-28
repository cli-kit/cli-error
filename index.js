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

var ErrorDefinition = require('./lib/definition');
var CliError = require('./lib/error')(config).Error;
var file = require('./lib/file')(config).file;
var define = require('./lib/define')(config).define;
var load = require('./lib/load');
var errors = require('./lib/define').errors;
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
  assert(err instanceof ErrorDefinition,
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

module.exports = function configure(conf) {
  for(var z in conf) {
    config[z] = conf[z];
  }
  lc.language = config.lang;
  return module.exports;
}

module.exports.define = define;
module.exports.definition = ErrorDefinition;
module.exports.error = CliError;
module.exports.errors = errors;
module.exports.exit = exit;
module.exports.file = file;
module.exports.load = load;
module.exports.raise = raise;
module.exports.warn = warn;
