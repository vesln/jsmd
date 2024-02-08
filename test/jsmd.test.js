var Rewriter = require('../lib/jsmd/rewriter');
var verifyFile = require('..').verifyFile;
var run = function run(file, fn) {
  verifyFile(fixture(file), fn);
};

test('ignores code different than javascript', function(done) {
  run('ruby', done);
});

test('ignores line comments that are not assertions', function(done) {
  run('line-comments', done);
});

test('can assert properly', function(done) {
  run('assertions', done);
});

test('returns an error when the verification was not successful', function(done) {
  run('bad', function(err) {
    err.should.be.ok;
    done();
  });
});

test('can require relative files', function(done) {
  run('require', done);
});

test('Works with ES6 code', function(done) {
	run('es6', done);
});

test('Works with ES2018 code', function(done) {
	run('es2018', done);
});

test('ignores node blocks', function(done) {
  run('gfm-node-block', done);
});

test('empty files are ok', function(done) {
  run('empty', done);
});

test('handles iife', function(done) {
  run('iife', done);
});
