var fs = require('fs');
var Rewriter = require('../lib/jsmd/rewriter');

var base = __dirname + '/compile/';

fs.readdirSync(base).forEach(function(file) {
  if (!/\.md$/.test(file)) return;
  var md = fs.readFileSync(base + file, 'utf8');
  new Rewriter(md).compile(function(compiled) {
    var expected = fs.readFileSync(base + file.replace(/md$/, 'js'), 'utf8');
    test('compiles files as expected: ' + file, function() {
      compiled.should.eq(expected.trim());
    });
  });
});
