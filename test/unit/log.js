var AssertionError = require('assert').AssertionError;
var expect = require('chai').expect;
var clierr = require('../..'),
  define = clierr.define;

describe('cli-error:', function() {
  beforeEach(function(done) {
    clierr.open('log/test-log.log', 'w');
    clierr.clear();
    done();
  });
  afterEach(function(done) {
    clierr.clear();
    clierr.close();
    done();
  });
  it('should log to file', function(done) {
    var key = 'EARGLENGTH';
    var message = 'too few arguments';
    var def = define(key, message);
    var e = def.toError();
    e.warn();
    e.error();
    // TODO: assert on file contents
    done();
  });
})
