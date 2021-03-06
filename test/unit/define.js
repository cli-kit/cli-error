var expect = require('chai').expect;
var clierr = require('../..'),
  define = clierr.define,
  definition = clierr.ErrorDefinition,
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
  it('should define errors', function(done) {
    var errors = clierr.errors;
    var key = 'EARGLENGTH';
    var message = 'too few arguments';
    var def = define(key, message);
    expect(def).to.be.an.instanceof(definition);
    var keys = Object.keys(errors);
    expect(keys.length).to.be.a('number').that.equals(1);
    expect(def.key).to.be.a('string').that.equals(key);
    expect(def.message).to.be.a('string').that.equals(message);
    expect(errors[key]).to.be.an.instanceof(definition).that.equals(def);
    expect(def.code).to.be.a('number').that.equals(config.start);
    done();
  });
  it('should define error with specific code (no parameters)', function(done) {
    var errors = clierr.errors;
    var key = 'EARGLENGTH';
    var message = 'too few arguments';
    var def = define(key, message, 255);
    expect(def.key).to.be.a('string').that.equals(key);
    expect(def.message).to.be.a('string').that.equals(message);
    expect(def.code).to.be.a('number').that.equals(255);
    done();
  });
  it('should define error with parameters and code', function(done) {
    var errors = clierr.errors;
    var key = 'EARGLENGTH';
    var message = 'too few arguments, got %s';
    var params = ['-xvf'];
    var def = define(key, message, params, 255);
    expect(def.key).to.be.a('string').that.equals(key);
    expect(def.message).to.be.a('string').that.equals(message);
    expect(def.parameters).to.eql(params);
    expect(def.code).to.be.a('number').that.equals(255);
    done();
  });
  it('should define with default start (invalid start)', function(done) {
    var config = {
      start: false
    }
    clierr(config);
    var key = 'EARGLENGTH';
    var message = 'too few arguments, got %s';
    var params = ['-xvf'];
    var def = define(key, message, params, 255);
    // reset so other tests do not break
    clierr({start: 128, lang: 'en'});
    done();
  });
  it('should clamp error code to 255', function(done) {
    var errors = clierr.errors;
    var key = 'EARGLENGTH';
    var message = 'too few arguments, got %s';
    var params = ['-xvf'];
    var def = define(key, message, params, 256);
    expect(def.code).to.be.a('number').that.equals(255);
    done();
  });
})
