var AssertionError = require('assert').AssertionError;
var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..'),
  define = clierr.define,
  definition = clierr.ErrorDefinition,
  error = clierr.CliError,
  config = clierr.config;

describe('cli-error:', function() {
  beforeEach(function(done) {
    clierr.clear();
    done();
  });
  afterEach(function(done) {
    clierr.clear();
    done();
  });
  it('should convert to error', function(done) {
    var errors = clierr.errors;
    var key = 'EINVALID_OPTION';
    var message = 'invalid option %s';
    var parameters = ['-x'];
    var def = define(key, message, parameters);
    var err = def.toError();
    expect(err).to.be.an.instanceof(error);
    expect(err).to.be.an.instanceof(Error);
    expect(err.name).to.be.a('string').that.equals(basename(process.argv[1]));
    expect(err.key).to.be.a('string').that.equals(key);
    expect(err.message).to.be.a('string').that.equals(message);
    expect(err.code).to.be.a('number').that.equals(config.start);
    expect(err.stack).to.be.a('string');
    expect(err.stacktrace).to.be.an('array');
    expect(err.parameters).to.be.an('array');
    expect(err.parameters.length).to.be.a('number').that.equals(1);
    done();
  });
})
