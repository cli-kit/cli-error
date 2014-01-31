var AssertionError = require('assert').AssertionError;
var expect = require('chai').expect;
var clierr = require('../..'),
  define = clierr.define;

describe('cli-error:', function() {
  beforeEach(function(done) {
    clierr.clear();
    done();
  });
  afterEach(function(done) {
    clierr.clear();
    clierr.close();
    done();
  });
  it('should throw assertion error on warn()', function(done) {
    function fn() {
      clierr.warn({});
    }
    expect(fn).throws(AssertionError);
    done();
  });
  it('should print message on warn()', function(done) {
    var config = {
      log: 'log/warn.log'
    }
    clierr(config);
    var key = 'EARGLENGTH';
    var message = 'too few arguments';
    var def = define(key, message);
    clierr.warn(def);
    done();
  });
})
