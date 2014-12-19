'use strict';

var R = require('ramda');

/**
 * Explode provided object.
 *
 * Return each key/value pair as an object in an array.
 *
 * @param {Object} src
 * return {[Object]}
 */

exports.explode = R.pipe(
  R.toPairs,
  R.map(R.apply(R.createMapEntry))
);
