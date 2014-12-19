'use strict';

/* global Proxy: false */

var R = require('ramda');
var path = require('path');
var resource = require('./resource');

/**
 * Resource proxy handler.
 */

module.exports = {

  /**
   * Get hook.
   *
   * If property exists, return it. Otherwise, return
   * another proxified resource with the concatenated path.
   *
   * @param {Proxy} target
   * @param {String} name
   $ @return {*}
   */

  get: function (target, name) {
    // Inspect is called a lot, don't know why yet.
    if (name in target || 'inspect' === name) return target[name];
    return new Proxy(resource(path.join(target.path, name), target.opt), module.exports);
  },

  /**
   * Apply hook.
   *
   * Return a proxyfied resource with the id concatenated
   * in the path.
   *
   * @param {Proxy} target
   * @param {*} context
   * @param {[*]} args
   * @return {Proxy}
   */

  apply: function (target, context, args) {
    var id = (R.head(args) || '').toString();
    return new Proxy(resource(path.join(target.path, id), target.opt), module.exports);
  }
};