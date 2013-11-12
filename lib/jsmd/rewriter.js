/**
 * External dependencies.
 */

var marked = require('marked');
var parse = require('esprima').parse;
var replace = require('estraverse').replace;
var generate = require('escodegen').generate;

/**
 * Syntax constants.
 */

var LINE_COMMENT = 'Line';
var EXPRESSION = 'ExpressionStatement';

/**
 * Markdown to JavaScript rewriter.
 *
 * @param {String} input
 * @constructor
 */

function Rewriter(input) {
  this.input = input;
  this.name = '__jsmd__';
  this.header = parse('var ' + this.name + ' = require("assert").deepEqual;');
  this.assertions = [];
}

/**
 * Extract the JavaScript code from `input`.
 *
 * @param {Function} fn
 * @api public
 */

Rewriter.prototype.compile = function(fn) {
  var self = this;
  var buff = [];

  marked.setOptions({
    highlight: function (code, lang) {
      if (lang === 'js' || lang === 'javascript') buff.push(code);
    },
  });

  marked(this.input, function() {
    self.build(buff.join('\n'), fn);
  });
};

/**
 * Build the final source file.
 *
 * @param {String} source code
 * @param {Function} fn
 * @api private
 */

Rewriter.prototype.build = function(code, fn) {
  var tree = this.parse(code);
  var ast = this.buildAst(tree);
  ast.body.unshift(this.header);
  fn(generate(tree));
};

/**
 * Parse the given source and extract
 * all assertions.
 *
 * @param {String} source code
 * @returns {Object} ast
 * @api private
 */

Rewriter.prototype.parse = function(code) {
  var tree = parse(code, { comment: true, range: true, tokens: true, loc: true });

  tree.comments.forEach(function(comment) {
    if (comment.type !== LINE_COMMENT) return;
    var match = /^\s*=>\s*/.exec(comment.value);
    if (!match) return;
    var raw = comment.value.substring(match[0].length);
    var line = comment.loc.start.line;
    this.assertions[line] = parse(raw).body[0].expression;
  }, this);

  return tree;
};

/**
 * Build the new ast.
 *
 * @param {Object} ast
 * @returns {Object} new ast
 * @api private
 */

Rewriter.prototype.buildAst = function(ast) {
  var self = this;

  return replace(ast, {
    leave: function(node) {
      if (node.type !== EXPRESSION) return node;
      if (node.loc.start.line !== node.loc.end.line) return node;
      if (!self.assertions.hasOwnProperty(node.loc.start.line)) return node;
      return self.assertion(self.assertions[node.loc.start.line], node.expression);
    }
  });
};

/**
 * Build an expression statement that will
 * contain the actual assertion.
 *
 * @param {Object} expected
 * @param {Object} actual
 * @returns {Object}
 * @api private
 */

Rewriter.prototype.assertion = function(first, second) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: this.name,
      },
      arguments: [ first, second ]
    }
  };
};

/**
 * Primary export.
 */

module.exports = Rewriter;
