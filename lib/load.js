var define = require('./define').define;

/**
 *  Import definitions from an object.
 *
 *  @param source An array defining error messages.
 */
function load(source) {
  var i, v, d;
  for(i = 0;i < source.length;i++) {
    v = source[i];
    d = define(v.key, v.message, v.parameters, v.code);
    if(v.description) d.description = v.description;
  }
}

module.exports = load;
