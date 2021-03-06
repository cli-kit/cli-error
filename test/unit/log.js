var AssertionError = require('assert').AssertionError;
var expect = require('chai').expect;
var fs = require('fs');
var clierr = require('../..'),
  define = clierr.define;

describe('cli-error:', function() {
  beforeEach(function(done) {
    clierr.clear();
    done();
  });
  afterEach(function(done) {
    clierr.clear();
    clierr.config.log = null;
    done();
  });
  it('should throw error attempting to close before open', function(done) {
    function fn() {
      clierr.close();
    }
    expect(fn).throws(Error);
    done();
  });
  it('should throw error attempting to open invalid log', function(done) {
    function fn() {
      clierr.open();
    }
    expect(fn).throws(TypeError);
    done();
  });
  it('should log to file from config', function(done) {
    clierr({log: 'log/config.log'});
    var key = 'ECONFIG';
    var message = 'error message from config log';
    var def = define(key, message);
    var e = def.toError();
    e.warn();
    e.error();
    clierr.close();
    // TODO: assert on file contents
    done();
  });
  it('should log to file', function(done) {
    clierr.open('log/test-log.log', 'w');
    var key = 'EARGLENGTH';
    var message = 'too few arguments';
    var def = define(key, message);
    var e = def.toError();
    e.warn();
    e.error();
    clierr.close();
    // TODO: assert on file contents
    done();
  });
  it('should log to file with existing stream', function(done) {
    clierr.open(fs.createWriteStream('log/stream-log.log', {flags: 'w'}));
    var key = 'EARGLENGTH';
    var message = 'too few arguments';
    var def = define(key, message);
    var e = def.toError();
    e.warn();
    e.error();
    clierr.close();
    // TODO: assert on file contents
    done();
  });
})
