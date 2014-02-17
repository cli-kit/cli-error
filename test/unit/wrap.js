var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..');
//require('../../lib/error')({});
var CliError = clierr.CliError;

describe('cli-error:', function() {
  it('should wrap an existing error', function(done) {
    var key = 'EWRAP';
    var code = 128, parameters = ['wrapped'], expects = 'a wrapped error';
    var source = new Error('a %s error');
    var e = new CliError(source, code, parameters);
    e.key = key;
    expect(e.source).to.eql(source);
    expect(e.message).to.eql(source.message);
    expect(source.code).to.eql(e.code).to.eql(code);
    expect(source.parameters).to.eql(e.parameters).to.eql(parameters);
    var msg = e.format.apply(e, parameters);
    expect(msg).to.eql(expects);
    expect(e.key).to.eql(source.key).to.eql(key);
    expect(e.info).to.be.an('array');
    expect(e.stacktrace).to.be.an('array');
    expect(e.cause()).to.eql(source);
    var len = e.info.length;
    expect(e.info.length).to.eql(e.stacktrace.length);
    e.pop();
    expect(e.info.length).to.eql(e.stacktrace.length).to.eql(len - 1);
    e.shift();
    expect(e.info.length).to.eql(e.stacktrace.length).to.eql(len - 2);
    e.splice(1,2);
    expect(e.info.length).to.eql(e.stacktrace.length).to.eql(len - 4);
    done();
  });
})
