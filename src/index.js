/* global Proxy: true */
'use strict';

require('harmony-reflect');
var handler = require('./handler');
var resource = require('./resource');

/**
 * Module interface.
 */

module.exports = factory;

/**
 * Client factory.
 *
 * @param {Object} options
 * @param {String} options.url - api endpoint
 * @param {Object} options.headers - default headers
 * @param {Object} options.data - default data (request query or body)
 * @return {Proxy}
 */

function factory(options) {
  return new Proxy(resource('', options || {}), handler);
}
