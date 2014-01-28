var path = require('path'), config;
var load = require('./load');
var errors = require('./define').errors;
var lc = require('cli-locale');

/**
 *  Load error definitions from a file.
 */
function file(options, callback) {
  if(typeof options == 'function') {
    callback = options;
    options = {};
  }

  var fallback = options.fallback || config.lang;
  var lang = options.lang;
  var locales = options.locales || config.locales;
  var extension = 'json', file, source;
  var search = options.lc || config.lc;
  if(!lang) {
    lang = lc.find(search);
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

module.exports = function(conf) {
  config = conf;
  return module.exports;
}

module.exports.file = file;
