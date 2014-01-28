var define = require('./define').define;

/**
 *  Import definitions from an object.
 *
 *  @param source An array defining error messages.
 */
function load(source) {
  var i, v;
  for(i = 0;i < source.length;i++) {
    v = source[i];
    define(v.key, v.message, v.parameters, v.code);
  }
}

module.exports = load;
