var fs = require('fs');
var Rewriter = require('../lib/jsmd/rewriter');

describe('jsmd', function() {
  it('compiles files as expected', function() {
    var base = __dirname + '/compile/';

    fs.readdirSync(base).forEach(function(file) {
      if (!/\.md$/.test(file)) return;
      var md = fs.readFileSync(base + file, 'utf8');
      new Rewriter(md).compile(function(compiled) {
        var expected = fs.readFileSync(base + file.replace(/md$/, 'js'), 'utf8');
        compiled.should.eq(expected.trim());
      });
    });
  });
});
