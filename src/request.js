
'use strict';

var R = require('ramda');
var Promise = require('promise');
var request = require('superagent');
var explode = require('./util').explode;

/**
 * Create and execute request.
 *
 * @param {Object} options
 * @param {String} options.url
 * @param {String} options.method
 * @param {Object=} options.headers
 * @param {Object=} options.data
 * @return {Promise}
 */

module.exports = function doRequest(options) {
  var req = createRequest(options);
  return Promise.denodeify(req.end.bind(req))();
};

/**
 * Create and configure request.
 *
 * @param {Object} options
 * @return {Request}
 */

function createRequest(options) {
  var req = request[
    'delete' === options.method ? 'del' : options.method
  ](options.url).set(options.headers || {});

  if ('p' === R.head(options.method))
    return req.send(options.data || {});

  var setQuery = R.curryN(3, R.func)('query');
  return R.reduce(setQuery, req, explode(options.data));
}
