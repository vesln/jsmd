/**
 * Core dependencies.
 */

var fs = require('fs');
var Module = require('module');

/**
 * Internal dependencies.
 */

var Rewriter = require('./jsmd/rewriter');

/**
 * Read and verify `file`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

exports.verifyFile = function(path, fn) {
  var md = fs.readFileSync(path, 'utf8');
  exports.verify(md, path, fn);
};

/**
 * Verify given `source`.
 *
 * @param {String} markdown contents
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

exports.verify = function(md, path, fn) {
  new Rewriter(md).compile(function(js) {
    try { run(js, path); }
    catch (e) { return fn(e, js); }
    fn(null, js);
  });
};

/**
 * run `js` with all the usual global variables
 *
 * @param {String} js
 * @param {String} path
 * @api private
 */

function run(js, path){
  var mod = new Module(path);
  mod.filename = path;
  mod._compile(js, path);
}
