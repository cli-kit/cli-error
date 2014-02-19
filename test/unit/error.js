var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..');
var CliError = clierr.CliError;
var exit;

describe('cli-error:', function() {
  beforeEach(function(done) {
    exit = process.exit;
    process.exit = function(code) {return code;}
    clierr.clear();
    clierr.open('log/error.log');
    done();
  });
  afterEach(function(done) {
    process.exit = exit;
    clierr.clear();
    clierr.close();
    clierr({log: null});
    done();
  });
  it('should print warn', function(done) {
    var e = new CliError('mock CliError instance (warn)');
    e.warn();
    done();
  });
  it('should print warn (stacktrace)', function(done) {
    var e = new CliError('mock CliError instance (warn+stacktrace)');
    e.warn(true);
    done();
  });
  it('should print warn (stacktrace+parameters)', function(done) {
    var e = new CliError('mock CliError instance (%s)');
    e.warn(true, 'warn+stacktrace+parameters');
    done();
  });
  it('should print error', function(done) {
    var e = new CliError('mock CliError instance (error)');
    e.error();
    done();
  });
  it('should print error (stacktrace)', function(done) {
    var e = new CliError('mock CliError instance (error+stacktrace)');
    e.error(true);
    done();
  });
  it('should print error (string prefix)', function(done) {
    clierr({prefix: 'mock error: '});
    var e = new CliError('mock CliError instance (error+string prefix)');
    e.error(true);
    done();
  });
  it('should print error (function prefix)', function(done) {
    function prefix() {
      return 'mock function prefix: ';
    }
    clierr({prefix: prefix});
    var e = new CliError('mock CliError instance (function prefix)');
    e.error(true);
    done();
  });
  it('should ignore invalid prefix', function(done) {
    clierr({prefix: null});
    var e = new CliError('mock CliError instance (null prefix)');
    e.error(true);
    done();
  });
})
