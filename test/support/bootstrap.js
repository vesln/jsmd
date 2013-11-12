/**
 * Core dependencies.
 */

var join = require('path').join;

/**
 * External dependencies.
 */

var chai = require('chai');

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
  return join(__dirname, '..', 'fixtures', extra + '.md');
};
