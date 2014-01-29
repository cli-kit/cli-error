var util = require('util');
var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..'),
  define = clierr.define,
  definition = clierr.definition,
  error = clierr.error,
  raise = clierr.raise,
  errors = clierr.errors,
  config = clierr.config;

describe('cli-error:', function() {
  it('should throw error with definition parameters', function(done) {
    var errors = clierr.errors;
    var key = 'EINVALID_OPTION';
    var message = 'invalid option %s';
    var parameters = ['-x'];
    var def = define(key, message, parameters);
    function fn() {
      raise(errors.EINVALID_OPTION);
    }
    expect(fn).throw(error);
    expect(fn).throw('invalid option -x');
    done();
  });
})
