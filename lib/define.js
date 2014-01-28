var config, errors = {};
var ErrorDefinition = require('./definition');

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

module.exports = function(conf) {
  config = conf;
  return module.exports;
}

module.exports.define = define;
module.exports.errors = errors;
