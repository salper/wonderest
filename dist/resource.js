"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var $__ramda__,
    $__url__,
    $__hooks__,
    $__request__;
'use strict';
var R = ($__ramda__ = require("ramda"), $__ramda__ && $__ramda__.__esModule && $__ramda__ || {default: $__ramda__}).default;
var url = ($__url__ = require("url"), $__url__ && $__url__.__esModule && $__url__ || {default: $__url__}).default;
var Hooks = ($__hooks__ = require("./hooks"), $__hooks__ && $__hooks__.__esModule && $__hooks__ || {default: $__hooks__}).default;
var Request = ($__request__ = require("./request"), $__request__ && $__request__.__esModule && $__request__ || {default: $__request__}).default;
var Resource = function Resource(path, parent) {
  this.parent = parent;
  this._path = path;
  this._headers = {};
  this._data = {};
  this._options = {};
  this._hooks = new Hooks(this);
};
var $Resource = Resource;
($traceurRuntime.createClass)(Resource, {
  get path() {
    var path = this._path.replace(/^\/*|\/*$/g, '');
    return !this.parent ? path : url.resolve(this.parent.path + '/', path);
  },
  get client() {
    return !this.parent ? this : this.parent.client;
  },
  headers: function(key, value) {
    return this._getterSetter('headers', key, value);
  },
  data: function(key, value) {
    return this._getterSetter('data', key, value);
  },
  options: function(key, value) {
    return this._getterSetter('options', key, value);
  },
  _getterSetter: function(name, key, value) {
    if ('Undefined' === R.type(key))
      return this._get(name);
    if ('Object' === R.type(key))
      return this._set(name, key);
    if ('Undefined' === R.type(value))
      return this._get(name, key);
    return this._set(name, key, value);
  },
  _get: function(name, key) {
    var value = this['_' + name];
    if (!this.parent)
      return 'Undefined' === R.type(key) ? value : value[key];
    if ('String' === R.type(key)) {
      return 'Undefined' === R.type(value[key]) ? this.parent[name](key) : value[key];
    }
    return R.mixin(this.parent[name](), value);
  },
  _set: function(name, key, value) {
    if ('String' === R.type(key))
      this['_' + name][key] = value;
    else
      this['_' + name] = key;
    return this;
  },
  resource: function(path) {
    return new $Resource(path, this);
  },
  hook: function(name, fn) {
    this._hooks.add(name, fn);
    return this;
  },
  notify: function(name) {
    for (var args = [],
        $__5 = 1; $__5 < arguments.length; $__5++)
      args[$__5 - 1] = arguments[$__5];
    return this._hooks.exec(name, args);
  },
  request: function() {
    return new Request(this);
  }
}, {});
var $__default = Resource;
