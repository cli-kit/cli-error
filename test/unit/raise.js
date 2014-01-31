var util = require('util');
var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..'),
  define = clierr.define,
  definition = clierr.ErrorDefinition,
  error = clierr.CliError,
  raise = clierr.raise,
  errors = clierr.errors,
  config = clierr.config;

describe('cli-error:', function() {
  it('should throw error with definition parameters', function(done) {
    var errors = clierr.errors;
    var key = 'EINVALID_OPTION';
    var message = 'invalid option %s';
    var parameters = ['-x'];
    define(key, message, parameters);
    function fn() {
      raise(errors.EINVALID_OPTION);
    }
    expect(fn).throw(error);
    expect(fn).throw('invalid option -x');
    done();
  });
  it('should throw error with runtime parameters', function(done) {
    var errors = clierr.errors;
    var key = 'EINVALID_OPTION';
    var message = 'invalid option %s';
    var opt = '-x';
    define(key, message);
    function fn() {
      raise(errors.EINVALID_OPTION, opt);
    }
    expect(fn).throw(error);
    expect(fn).throw('invalid option -x');
    done();
  });
})
