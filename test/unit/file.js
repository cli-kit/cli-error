var path = require('path');
var expect = require('chai').expect;
var clierr = require('../..'),
  file = clierr.file,
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
  it('should load definitions from a file', function(done) {
    process.env.LC_MESSAGES = 'en_GB.UTF-8';
    var locales = path.normalize(
      path.join(__dirname, '..', '..', 'bin', 'locales'));
    var expected = path.join(locales, 'en_gb.json');
    var msg = 'nothing to be done (en_gb)';
    clierr({locales: locales});
    clierr.file(function(err, file, errors, lang) {
      //console.dir(errors);
      expect(err).to.eql(null);
      expect(errors).to.be.an('object')
      expect(file).to.eql(expected);
      expect(errors.ENOOP).to.be.an('object');
      expect(errors.ENOOP.message).to.eql(msg);
      //var e = errors.ENOOP.toError();
      //console.dir(e);
      clierr({locales: null});
      done();
    });
  });
  it('should load definitions from a file (no callback)', function(done) {
    process.env.LC_MESSAGES = 'en_GB.UTF-8';
    var locales = path.normalize(
      path.join(__dirname, '..', '..', 'bin', 'locales'));
    var expected = path.join(locales, 'en_gb.json');
    var msg = 'nothing to be done (en_gb)';
    clierr({locales: locales});
    clierr.file();
    done();
  });
  it('should callback on missing locales', function(done) {
    var locales = path.normalize(
      path.join(__dirname, '..', '..', 'non-existent', 'locales'));
    clierr({locales: locales});
    //console.dir(locales);
    clierr.file(function(err, file, errors, lang) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
  it('should callback with error on missing locale file', function(done) {
    var locales = path.normalize(
      path.join(__dirname, '..', '..', 'bin', 'locales'));
    clierr({locales: locales});
    //console.dir(locales);
    clierr.file({lang: 'de'}, function(err, file, errors, lang) {
      //expect(err).to.be.instanceof(Error);
      expect(err).to.eql(null);
      done();
    });
  });
})
