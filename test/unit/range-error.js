var util = require('util');
var expect = require('chai').expect;
var basename = require('path').basename;
var clierr = require('../..'), CliError = clierr.CliError;

describe('cli-error:', function() {
  it('should handle error without stack (range error)', function(done) {
    var range = null;
    try {
      function infinite() {
        infinite();
      }
      infinite();
    }catch(e) {
      range = e;
    }
    var err = new CliError(range);
    expect(err.message).to.eql('Maximum call stack size exceeded');
    err.printstack();
    done();
  });
})
