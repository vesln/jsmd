var join = require('path').join;
var nixt = require('nixt');
var bin = join(__dirname, '..', 'bin');

var app = function() {
  return nixt({ newlines: false })
    .cwd(bin)
    .base('./jsmd ')
    .clone();
};

test('--version', function(done) {
  app()
  .stdout(require('../package.json').version)
  .run('--version')
  .end(done);
});

test('--help', function(done) {
  app()
  .stdout(/Usage: jsmd <path>/)
  .run('--help')
  .end(done);
});

test('Verification of valid Markdown files', function(done) {
  app()
  .stdout('')
  .code(0)
  .run(fixture('empty'))
  .end(done);
});

test('Verification of bad Markdown files', function(done) {
  app()
  .code(1)
  .run(fixture('bad'))
  .end(done);
});
