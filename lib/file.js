var path = require('path'), config;
var load = require('./load');
var errors = require('./define').errors;

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

module.exports = function(conf) {
  config = conf;
  return module.exports;
}

module.exports.file = file;
