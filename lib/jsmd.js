/**
 * Core dependencies.
 */

var fs = require('fs');
var exec = require('child_process').exec;

/**
 * External dependencies.
 */

var tmp = require('temporary');

/**
 * Internal dependencies.
 */

var Rewriter = require('./jsmd/rewriter');

/**
 * Read and verify `file`.
 *
 * @param {String} path
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

exports.verifyFile = function(path, options, fn) {
  var file = fs.readFileSync(path, 'utf8');
  exports.verify(file, options, fn);
};

/**
 * Verify given `source`.
 *
 * @param {String} markdown contents
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

exports.verify = function(md, options, fn) {
  var rewriter = new Rewriter(md);

  var out = rewriter.compile(function(source) {
    var file = new tmp.File();
    file.writeFileSync(source);

    exec('node ' + file.path, function(err) {
      fn(err, file.path);
      if (!err && !options.debug) return file.unlinkSync();
    });
  });
};
