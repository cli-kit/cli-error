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
  it('should create error with default name', function(done) {
    clierr.clear();
    var message = 'invalid option';
    var expected = message;
    var name = basename(process.argv[1]);
    clierr({name: null});
    var err = new clierr.CliError(message);
    var o = err.toObject(false);
    expect(o.message).to.be.a('string').that.equals(expected);
    clierr({name: name});
    done();
  });
  it('should convert to object (without key)', function(done) {
    clierr.clear();
    var message = 'invalid option';
    var expected = message;
    var err = new clierr.CliError(message);
    var o = err.toObject(false);
    expect(o.message).to.be.a('string').that.equals(expected);
    done();
  });
  it('should convert to object (zero parameters)', function(done) {
    clierr.clear();
    var key = 'EINVALID_OPTION';
    var message = 'invalid option';
    var expected = message;
    var def = define(key, message);
    var err = def.toError();
    var o = err.toObject(false);
    //var s = err.stringify(false, opt);
    expect(o.message).to.be.a('string').that.equals(expected);
    done();
  });
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
  it('should convert to object (definition parameters)', function(done) {
    clierr.clear();
    var key = 'EINVALID_OPTION';
    var message = 'invalid option %s';
    var opt = '-x';
    var expected = util.format(message, opt);
    var def = define(key, message, [opt]);
    var err = def.toError();
    expect(err.parameters).to.eql([opt]);
    // without stacktrace
    var o = err.toObject(false);
    expect(o.message).to.eql(expected);
    done();
  });
})
