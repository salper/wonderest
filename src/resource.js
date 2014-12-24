'use strict';

import R from 'ramda';
import url from 'url';
import Hooks from './hooks';
import Request from './request';

/**
 * Resource class def.
 */

class Resource {

  /**
   * Resource constructor.
   *
   * @param {String} path
   * @param {Resource=} parent
   */

  constructor(path, parent) {
    this.parent = parent;
    
    this._path = path;
    this._headers = {};
    this._data = {};
    this._options = {};
    this._hooks = new Hooks(this);
  }

  /**
   * @property {String} resolved resource path
   */

  get path() {
    let path = this._path.replace(/^\/*|\/*$/g, '');
    return ! this.parent ? path : url.resolve(this.parent.path + '/', path);
  }

  /**
   * @property {Resource} resource top client
   */

  get client() {
    return ! this.parent ? this : this.parent.client;
  }

  /**
   * Headers getter/setter.
   *
   * @param {String|Object=} key
   * @param {*=} value
   * @return {Resource|*}
   */

  headers(key, value) {
    return this._getterSetter('headers', key, value);
  }

  /**
   * Data getter/setter.
   *
   * @param {String|Object=} key
   * @param {*=} value
   * @return {Resource|*}
   */

  data(key, value) {
    return this._getterSetter('data', key, value);
  }

  /**
   * Options getter/setter.
   *
   * @param {String|Object=} key
   * @param {*=} value
   * @return {Resource|*}
   */

  options(key, value) {
    return this._getterSetter('options', key, value);
  }

  /**
   * Internal getter/setter proxy.
   *
   * @param {String} name
   * @param {String|Object=} key
   * @param {*=} value
   * @return {Resource|*}
   * @private
   */

  _getterSetter(name, key, value) {
    if ('Undefined' === R.type(key))
      return this._get(name);

    if ('Object' === R.type(key))
        return  this._set(name, key);

    if ('Undefined' === R.type(value))
      return this._get(name, key);

    return this._set(name, key, value);
  }

  /**
   * Internal getter.
   *
   * @param {String} name
   * @param {String=} key
   * @return {*}
   * @private
   */

  _get(name, key) {
    let value = this['_' + name];

    if (! this.parent)
      return 'Undefined' === R.type(key) ? value : value[key];

    if ('String' === R.type(key)){
      return 'Undefined' === R.type(value[key]) ? this.parent[name](key) : value[key];
    }

    return R.mixin(this.parent[name](), value);
  }

  /**
   * Internal setter.
   *
   * @param {String} name
   * @param {String|Object} key
   * @param {*=} value
   * @return {Resource}
   * @private
   */

  _set(name, key, value) {
    if ('String' === R.type(key))
      this['_' + name][key] = value;
    else
      this['_' + name] = key;

    return this;
  }

  /**
   * Sub resource factory.
   *
   * @param {String} path
   * @return {Resource}
   */

  resource(path) {
    return new Resource(path, this);
  }

  /**
   * Hook registrar.
   *
   * @param {String} name
   * @param {Function} fn
   * @return {Resource}
   */

  hook(name, fn) {
    this._hooks.add(name, fn);
    return this;
  }

  /**
   * Hooks notifier.
   *
   * @param {String} name
   * @param {...*} args
   * @return {Promise}
   */

  notify(name, ...args) {
    return this._hooks.exec(name, args);
  }

  /**
   * @property {Request} request agent.
   */

  request() {
    return new Request(this);
  }

}

/**
 * Module interface.
 */

export default Resource;

