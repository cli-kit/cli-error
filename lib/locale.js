/**
 *  Sanitize the value of an LC variable removing any character
 *  encoding portion, such that en_GB.UTF-8 becomes en_gb.
 *
 *  @param lang A language identifier extracted from an LC variable.
 */
function sanitize(lang) {
  return lang.replace(/\..*$/, '').toLowerCase();
}

/**
 *  Find the value of an LC environment variable and return a
 *  sanitized represention of the locale.
 *
 *  If no variable value is found in the search array then this
 *  method returns the first available LC variable.
 *
 *  @param search An array of LC variables to prefer.
 */
function find(search) {
  var lang, search = config.lc || [], i, k, v, re = /^LC_/;
  for(i = 0;i < search.length;i++) {
    lang = sanitize(process.env[process.env[search[i]]] || '');
    if(lang) return lang;
  }
  // nothing found in search array, find first available
  if(!lang) {
    for(k in process.env) {
      v = process.env[k];
      if(re.test(k) && v) {
        lang = sanitize(v);
      }
    }
  }
  return lang;
}

module.exports.sanitize = sanitize;
module.exports.find = find;
