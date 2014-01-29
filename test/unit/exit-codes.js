var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var expect = require('chai').expect;
var async = require('async');
var clierr = require('../..');

var bin = path.join(path.normalize(path.join(__dirname, '..', '..')), 'bin');
var commands = [];
var expected = clierr.config.start;

var contents = fs.readdirSync(bin);
contents.forEach(function(file) {
  var stat = fs.statSync(path.join(bin, file));
  if(!stat.isDirectory()) {
    commands.push(path.join(bin, file));
  }
});

describe('cli-error:', function() {
  it('should verify exit status codes', function(done) {
    async.eachSeries(commands, function(cmd, callback) {
      exec(cmd, function(err, stdout, stderr) {
        expect(err.code).to.be.a('number').that.equals(expected);
        callback();
      })
    }, function(err) {
      done();
    });
  });
})
