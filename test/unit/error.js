var expect = require('chai').expect;
var clierr = require('../..'),
  define = clierr.define,
  definition = clierr.definition,
  error = clierr.error,
  errors = clierr.errors,
  config = clierr.config;

describe('cli-error:', function() {
  it('should convert to error', function(done) {
    clierr.clear();
    var key = 'EINVALID_OPTION';
    var message = 'invalid option %s';
    var parameters = ['-x'];
    var def = define(key, message);
    var err = def.toError();
    expect(err).to.be.an.instanceof(error);
    expect(err).to.be.an.instanceof(Error);
    expect(err.key).to.be.a('string').that.equals(key);
    expect(err.message).to.be.a('string').that.equals(message);
    expect(err.code).to.be.a('number').that.equals(config.start);
    expect(err.stack).to.be.a('string');
    expect(err.stacktrace).to.be.an('array');
    done();
  });
})
