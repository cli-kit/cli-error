var util = require('util');
var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..'),
  define = clierr.define,
  definition = clierr.ErrorDefinition,
  error = clierr.error,
  errors = clierr.errors,
  config = clierr.config;

describe('cli-error:', function() {
  it('should convert to object and stringify', function(done) {
    clierr.clear();
    var key = 'EINVALID_OPTION';
    var message = 'invalid option %s';
    var opt = '-x';
    var expected = util.format(message, opt);
    var def = define(key, message);
    var err = def.toError();
    // without stacktrace
    var o = err.toObject(false, opt);
    var s = err.stringify(false, opt);
    expect(o.message).to.be.a('string').that.equals(expected);
    expect(o.key).to.be.a('string').that.equals(key);
    expect(o.name).to.be.a('string').that.equals(config.name);
    var stringified = JSON.stringify(o);
    expect(s).to.be.a('string').that.equals(stringified);
    // with stacktrace
    o = err.toObject(true, opt);
    s = err.stringify(true, opt);
    expect(o.stack).to.be.an('array');
    expect(o.stack.length).to.be.above(0);
    stringified = JSON.stringify(o);
    expect(s).to.be.a('string').that.equals(stringified);
    done();
  });
})
