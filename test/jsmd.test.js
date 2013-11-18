var Rewriter = require('../lib/jsmd/rewriter');
var verifyFile = require('..').verifyFile;
var run = function run(file, fn) {
  verifyFile(fixture(file), fn);
};
var compile = function(file, fn){
  var path = fixture(file);
  var md = require('fs').readFileSync(path, 'utf8');
  new Rewriter(md).compile(fn);
};

describe('jsmd', function() {
  it('ignores code different than javascript', function(done) {
    run('ruby', function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('ignores line comments that are not assertions', function(done) {
    run('line-comments', function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('can assert properly', function(done) {
    run('assertions', function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('returns an error when the verification was not successful', function(done) {
    run('bad', function(err) {
      should.exist(err);
      done();
    });
  });

  it('can require relative files', function(done) {
    run('require', function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('can handle multi-line expressions', function(done) {
    run('multi-line', function(err) {
      should.not.exist(err);
      done();
    });
  });

  it.skip('supports automatic semicolon insertion (ASI)', function(done) {
    compile('ASI', function(js) {
      js.should.match(/__jsmd__\(1,/);
      js.should.match(/__jsmd__\(2,/);
      done();
    });
  });
});
