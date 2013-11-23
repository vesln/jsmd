/**
 * External dependencies.
 */

var Lexer = require('marked').Lexer;
var parse = require('esprima').parse;
var replace = require('estraverse').replace;
var generate = require('escodegen').generate;

/**
 * Syntax constants.
 */

var LINE_COMMENT = 'Line';
var EXPRESSION = 'ExpressionStatement';

/**
 * Lexer constants.
 */

var CODE = 'code';
var HTML = 'html';

/**
 * Markdown to JavaScript rewriter.
 *
 * @param {String} input
 * @constructor
 */

function Rewriter(input) {
  this.input = input.replace(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g, '\n');
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
  var buff = [];
  var lexer = new Lexer;

  lexer.lex(this.input).forEach(function(token) {
    if (token.type === CODE && ~['js', 'javascript'].indexOf(token.lang)) {
      buff.push(token.text);
    }

    if (token.type === HTML) {
      var match = token.text.trim().match(/^<!--\s*js\s+([\S\s]*)-->$/);
      if (match) buff.push(match[1]);
    }
  });

  this.build(buff.join('\n'), fn);
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
  var ast = this.buildAst(tree, code);
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
    raw = '(function() { return ' + raw + '; })()';
    this.assertions[line] = parse(raw).body[0].expression.callee.body.body[0].argument;
  }, this);

  return tree;
};

/**
 * Build the new ast.
 *
 * @param {Object} ast
 * @param {String} input
 * @returns {Object} new ast
 * @api private
 */

Rewriter.prototype.buildAst = function(ast, input) {
  var assertions = this.assertions;
  var self = this;

  return replace(ast, {
    leave: function(node) {
      if (node.type !== EXPRESSION) return node;
      var line = node.loc.end.line;
      var newlines = input.substring(node.range[0], node.range[1]).match(/\n(?=\s*$)/g) || [];
      line -= newlines.length;
      if (!assertions.hasOwnProperty(line)) return node;
      return self.assertion(assertions[line], node.expression);
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
      arguments: [first, second]
    }
  };
};

/**
 * Primary export.
 */

module.exports = Rewriter;
