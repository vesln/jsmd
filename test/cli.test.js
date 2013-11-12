var join = require('path').join;
var nixt = require('nixt');
var bin = join(__dirname, '..', 'bin');

var app = function() {
  return nixt({ newlines: false })
    .cwd(bin)
    .base('./jsmd ')
    .clone();
};

describe('cli', function() {
  describe('--version', function() {
    it('prints the app version', function(done) {
      app()
      .stdout(require('../package.json').version)
      .run('--version')
      .end(done);
    });
  });

  describe('--help', function() {
    it('prints help', function(done) {
      app()
      .stdout(/Usage: jsmd <path>/)
      .run('--help')
      .end(done);
    });
  });

  describe('main', function() {
    it('verifies the given file', function(done) {
      app()
      .stdout('')
      .code(0)
      .run(fixture('empty'))
      .end(done);
    });
  });
});
