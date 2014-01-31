var expect = require('chai').expect;
var clierr = require('../..'),
  load = clierr.load,
  definition = clierr.ErrorDefinition,
  errors = clierr.errors,
  config = clierr.config;

describe('cli-error:', function() {
  beforeEach(function(done) {
    clierr.clear();
    done();
  });
  afterEach(function(done) {
    clierr.clear();
    done();
  });
  it('should load errors', function(done) {
    var errors = clierr.errors;
    var key = 'EARGLENGTH';
    var message = 'too few arguments';
    var description = 'Error thrown when there are not enough arguments'
    var source = [
      {
        key: key,
        message: message,
        description: description
      }
    ];
    load(source);
    var def = errors[key];
    expect(def).to.be.an.instanceof(definition);
    expect(def.key).to.eql(key);
    expect(def.message).to.eql(message);
    expect(def.code).to.be.a('number').that.equals(config.start);
    expect(def.description).to.eql(description);
    done();
  });
})
