'use strict';

var R = require('ramda');
var url = require('url');
var methods = require('methods');
var request = require('./request');

/**
 * Public interface.
 */

module.exports = factory;

/**
 * Resource factory.
 *
 * @param {String} path
 * @param {Object} options
 */

function factory(path, options) {

  /**
   * Resource constructor.
   */

  function Resource() {}

  /**
   * @property {String}
   */

  Resource.path = path || '';

  /**
   * @property {Object}
   */

  Resource.opt = options || {};

  /**
   * Map HTTP verbs on resource function.
   *
   * @param {Object=} headers
   * @param {Object=} data
   */

  R.forEach(function (verb) {
    Resource[verb] = function (headers, data) {
      return request({
        url: url.resolve(R.propOr('url', '', Resource.opt), Resource.path),
        method: verb,
        headers: R.mixin(R.propOr('headers', {}, Resource.opt), headers || {}),
        data: R.mixin(R.propOr('data', {}, Resource.opt), data || {})
      });
    };
  }, methods);

  /**
   * Return Resource constructor.
   */

  return Resource;
}