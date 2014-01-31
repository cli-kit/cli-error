var AssertionError = require('assert').AssertionError;
var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..'),
  define = clierr.define;
var exit;

describe('cli-error:', function() {
  beforeEach(function(done) {
    exit = process.exit;
    process.exit = function(code) {return code;}
    clierr.clear();
    done();
  });
  afterEach(function(done) {
    process.exit = exit;
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
  it('should return exit code', function(done) {
    clierr({log: 'log/exit.log'});
    var key = 'EARGLENGTH';
    var message = 'mock exit error message';
    var def = define(key, message);
    var code = clierr.exit(def);
    expect(code).to.eql(128);
    clierr.close();
    clierr({log: null});
    done();
  });
})
