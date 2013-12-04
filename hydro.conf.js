/**
 * Core dependencies.
 */

var join = require('path').join;

/**
 * External dependencies.
 */

var chai = require('chai');
var hydro = require('hydro');

/**
 * Register `should`.
 */

global.should = chai.should();

/**
 * Include stack traces.
 */

chai.Assertion.includeStack = true;

/**
 * Return the path to a fixture.
 *
 * @returns {String}
 * @api public
 */

global.fixture = function(extra) {
  return join(__dirname, 'test', 'fixtures', extra + '.md');
};

/**
 * Export `hydro`.
 */

global.test = hydro;
