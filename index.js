var assert = require('assert');
var path = require('path'), basename = path.basename, dirname = path.dirname;
var util = require('util');
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
 *  Print the stack strace.
 *
 *  @api private
 *
 *  @param method The console method to invoke.
 */
CliError.prototype.printstack = function(method) {
  for(var i = 0;i < this.stacktrace.length;i++) {
    method('%s %s', config.pad, this.stacktrace[i]);
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
CliError.prototype.stringify = function(trace) {
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
  if(!code && errors[key] && errors[key].code) {
    code = errors[key].code;
  }
  if(!code) code = Object.keys(errors).length + start;
  // re-use error code if overwriting
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
    'argument to exit must be error definition');
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
 *  @param source An object defining error messages.
 */
function load(source) {
  var k, v;
  for(k in source) {
    v = source[k];
    define(k, v.message, v.parameters, v.code);
  }
}

/**
 *  Load error definitions from a file.
 */
function file(options, callback) {
  if(typeof options == 'function') {
    callback = options;
    options = {};
  }

  // convert an LC environment variable to
  // the file loading convention
  function replace(lang) {
    return lang.replace(/\..*$/, '').toLowerCase();
  }

  // find first available LC variable in process.env
  // checking config.lc defined list first
  function find() {
    var lang, search = config.lc || [], i, k, v, re = /^LC_/;
    for(i = 0;i < search.length;i++) {
      lang = replace(process.env[process.env[search[i]]] || '');
      if(lang) return lang;
    }
    // nothing found in search array, find first available
    if(!lang) {
      for(k in process.env) {
        v = process.env[k];
        if(re.test(k) && v) {
          lang = replace(v);
        }
      }
    }
    return lang;
  }

  var fallback = options.fallback || config.lang;
  var lang = options.lang;
  var locales = options.locales || config.locales;
  var extension = 'json', file, source;
  if(!lang) {
    lang = find();
  }

  // always load fallback definitions
  try {
    file = path.join(locales, fallback) + '.' + extension;
    source = require(file);
    load(source);
  }catch(e) {
    return callback(e);
  }

  // only attempt to load if lang has been specified
  // or if we found a lang in the LC variables
  if(lang) {
    // TODO: test file exists
    file = path.join(locales, lang) + '.' + extension;
    try {
      source = require(file);
      load(source);
    }catch(e) {
      return callback(e);
    }
    return callback(null, file, errors, lang);
  }
  callback(null, file, errors, lang);
}

module.exports = function configure(conf) {
  for(var z in conf) {
    config[z] = conf[z];
  }
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
