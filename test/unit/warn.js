var AssertionError = require('assert').AssertionError;
var expect = require('chai').expect;
var clierr = require('../..'),
  load = clierr.load,
  definition = clierr.ErrorDefinition,
  errors = clierr.errors;

describe('cli-error:', function() {
  beforeEach(function(done) {
    clierr.clear();
    done();
  });
  afterEach(function(done) {
    clierr.clear();
    done();
  });
  it('should throw assertion error on warn()', function(done) {
    function fn() {
      clierr.warn({});
    }
    expect(fn).throws(AssertionError);
    done();
  });
})
