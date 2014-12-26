'use strict';

import Promise from 'bluebird';

/**
 * Module interface.
 */

export default class Hooks {

  /**
   * @param {Resource} resource
   */

  constructor(resource) {
    this._resource = resource;
    this._hooks = {};
  }

  /**
   * Push handler to the given name stack.
   *
   * @param {String} name
   * @param {Function} fn
   * @return {Hooks}
   */

  add(name, fn) {
    this._hooks[name] = (this._hooks[name] || []).concat(fn);
    return this;
  }

  /**
   * Execute hook name stack.
   * Parent resource hook is executed first.
   *
   * @param {String} name
   * @param {[*]} args
   * @return {Promise}
   */

  exec(name, args) {
    var promise = this._execParent(name, args);
    if (! (this._hooks[name] || []).length)
      return promise;

    let reducer = (args, fn) => Promise.resolve(fn(...args));
    return promise.then(args =>  Promise.reduce(this._hooks[name], reducer, args));
  }

  /**
   * Execute parent resource hook name stack.
   *
   * @param {String} name
   * @param {[*]} args
   * @return {Promise}
   * @private
   */

  _execParent(name, args) {
    return ! this._resource.parent ?
      Promise.resolve(args) :
      this._resource.parent.notify(name, ...args);
  }
}
