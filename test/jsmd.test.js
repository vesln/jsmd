var Rewriter = require('../lib/jsmd/rewriter');
var verifyFile = require('..').verifyFile;
var run = function run(file, fn) {
  verifyFile(fixture(file), fn);
};

test('ignores code different than javascript', function(done) {
  run('ruby', function(err) {
    should.not.exist(err);
    done();
  });
});

test('ignores line comments that are not assertions', function(done) {
  run('line-comments', function(err) {
    should.not.exist(err);
    done();
  });
});

test('can assert properly', function(done) {
  run('assertions', function(err) {
    should.not.exist(err);
    done();
  });
});

test('returns an error when the verification was not successful', function(done) {
  run('bad', function(err) {
    should.exist(err);
    done();
  });
});

test('can require relative files', function(done) {
  run('require', function(err) {
    should.not.exist(err);
    done();
  });
});
