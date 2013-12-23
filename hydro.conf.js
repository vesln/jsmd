/**
 * Core dependencies.
 */

var join = require('path').join;

/**
 * Return the path to a fixture.
 *
 * @returns {String}
 * @api public
 */

function fixture(extra) {
  return join(__dirname, 'test', 'fixtures', extra + '.md');
}

/**
 * Hydro configurations.
 *
 * @param {Hydro} hydro
 */

module.exports = function(hydro) {
  hydro.set({
    suite: 'jsmd',
    formatter: 'hydro-dot',
    tests: [
      'test/*.test.js'
    ],
    plugins: [
      'hydro-chai'
    ],
    proxies: {
      test: 'addTest'
    },
    chai: {
      styles: ['should'],
      stack: true
    },
    globals: {
      fixture: fixture
    }
  });
};
