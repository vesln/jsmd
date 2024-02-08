var join = require('path').join;
var nixt = require('nixt');
var bin = join(__dirname, '..', 'bin');
var crossPlatformBase = 'node ./jsmd ';

var escapeFixturePath = function(name) {
  return fixture(name).replace(/\\/g, '\\\\');
};

var app = function(base) {
  return nixt({ newlines: false })
    .cwd(bin)
    .base(base)
    .clone();
};

test('jsmd is executable', function(done) {
  if (process.platform !== 'win32') {
    app('./jsmd ')
    .stdout(require('../package.json').version)
    .run('--version')
    .end(done);
  } else {
    done();
  }
});

test('--version', function(done) {
  app(crossPlatformBase)
  .stdout(require('../package.json').version)
  .run('--version')
  .end(done);
});

test('--help', function(done) {
  app(crossPlatformBase)
  .stdout(/Usage: jsmd <path>/)
  .run('--help')
  .end(done);
});

test('Verification of valid Markdown files', function(done) {
  app(crossPlatformBase)
  .stdout('')
  .code(0)
  .run(escapeFixturePath('empty'))
  .end(done);
});

test('Verification of bad Markdown files', function(done) {
  app(crossPlatformBase)
  .code(1)
  .run(escapeFixturePath('bad'))
  .end(done);
});
