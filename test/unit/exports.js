var expect = require('chai').expect;
var clierr = require('../..');

describe('cli-error:', function() {
  it('should export properties', function(done) {
    expect(clierr).to.be.a('function');
    expect(clierr.config).to.be.an('object');
    expect(clierr.define).to.be.a('function');
    expect(clierr.ErrorDefinition).to.be.a('function');
    expect(clierr.CliError).to.be.a('function');
    expect(clierr.errors).to.be.a('object');
    expect(clierr.exit).to.be.a('function');
    expect(clierr.file).to.be.a('function');
    expect(clierr.load).to.be.a('function');
    expect(clierr.raise).to.be.a('function');
    expect(clierr.warn).to.be.a('function');
    expect(clierr.open).to.be.a('function');
    expect(clierr.close).to.be.a('function');
    done();
  });
})
