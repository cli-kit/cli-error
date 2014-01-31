var expect = require('chai').expect;
var clierr = require('../..'),
  load = clierr.load,
  definition = clierr.definition,
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
  it('should configure module', function(done) {
    var config = {
      start: 256,
      lang: 'en_us'
    }
    clierr(config);
    expect(clierr.config.start).to.eql(config.start);
    expect(clierr.config.lang).to.eql(config.lang);
    expect(require('cli-locale').language).to.eql(config.lang);
    done();
  });
})
