"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var $__bluebird__;
'use strict';
var Promise = ($__bluebird__ = require("bluebird"), $__bluebird__ && $__bluebird__.__esModule && $__bluebird__ || {default: $__bluebird__}).default;
var Hooks = function Hooks(resource) {
  this._resource = resource;
  this._hooks = {};
};
($traceurRuntime.createClass)(Hooks, {
  add: function(name, fn) {
    this._hooks[name] = (this._hooks[name] || []).concat(fn);
    return this;
  },
  exec: function(name, args) {
    var $__1 = this;
    var promise = this._execParent(name, args);
    if (!(this._hooks[name] || []).length)
      return promise;
    var reducer = (function(args, fn) {
      return Promise.resolve(fn.apply(null, $traceurRuntime.spread(args)));
    });
    return promise.then((function(args) {
      return Promise.reduce($__1._hooks[name], reducer, args);
    }));
  },
  _execParent: function(name, args) {
    var $__3;
    return !this._resource.parent ? Promise.resolve(args) : ($__3 = this._resource.parent).notify.apply($__3, $traceurRuntime.spread([name], args));
  }
}, {});
var $__default = Hooks;
