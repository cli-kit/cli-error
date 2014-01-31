var AssertionError = require('assert').AssertionError;
var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..'),
  define = clierr.define,
  definition = clierr.ErrorDefinition,
  error = clierr.error,
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
  it('should throw assertion error on exit()', function(done) {
    function fn() {
      clierr.exit({});
    }
    expect(fn).throws(AssertionError);
    done();
  });
})
