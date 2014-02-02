var CliError = require('./error').CliError;

/**
 *  Represents an error definition.
 *
 *  @param key The error identifier.
 *  @param message The error message.
 *  @param code The exit status code.
 *  @param parameters Message replacement parameters.
 */
var ErrorDefinition = function(key, message, code, parameters) {
  this.key = key;
  this.message = message;
  this.code = code;
  this.parameters = parameters;
}

/**
 *  Convert this definition to an error instance.
 */
ErrorDefinition.prototype.toError = function() {
  var err = new CliError(this.message, this.code,
    (this.parameters || []).slice(0));
  err.key = this.key;
  err.shift();
  return err;
}

module.exports = ErrorDefinition;
