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
    it('does not output anything when the verification went good', function(done) {
      app()
      .stdout('')
      .code(0)
      .run(fixture('empty'))
      .end(done);
    });

    it('exits with 1 when the verification was not ok', function(done) {
      app()
      .code(1)
      .run(fixture('bad'))
      .end(done);
    });
  });
});
