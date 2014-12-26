"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var $__ramda__,
    $__superagent__,
    $__methods__,
    $__bluebird__;
'use strict';
var R = ($__ramda__ = require("ramda"), $__ramda__ && $__ramda__.__esModule && $__ramda__ || {default: $__ramda__}).default;
var request = ($__superagent__ = require("superagent"), $__superagent__ && $__superagent__.__esModule && $__superagent__ || {default: $__superagent__}).default;
var methods = ($__methods__ = require("methods"), $__methods__ && $__methods__.__esModule && $__methods__ || {default: $__methods__}).default;
var Promise = ($__bluebird__ = require("bluebird"), $__bluebird__ && $__bluebird__.__esModule && $__bluebird__ || {default: $__bluebird__}).default;
var $__default = Request;
function Request(resource) {
  this._resource = resource;
}
Request.prototype = {
  _exectRequestHook: function() {
    return this._resource.notify('request', this._resource);
  },
  _execResponseHook: function(res, retry) {
    return this._resource.notify('response', this._resource, res, retry);
  },
  _send: function(method, data, headers) {
    var request = this._createRequest('delete' === method ? 'del' : method, R.mixin(this._resource.data(), data || {}), R.mixin(this._resource.headers(), headers || {}));
    return Promise.promisify(request.end.bind(request))();
  },
  _createRequest: function(method, data, headers) {
    return request[method](this._resource.path).set(headers)[['post', 'put', 'patch'].indexOf(method) >= 0 ? 'send' : 'query'](data);
  }
};
var $__7 = function() {
  var method = $__6.value;
  Request.prototype[method] = function(data, headers) {
    var $__4 = this;
    var retry = (function() {
      return $__4._send(method, data, headers);
    });
    return this._exectRequestHook().then((function() {
      return retry();
    })).then((function(res) {
      return $__4._execResponseHook(res, retry);
    })).spread((function(resource, res) {
      return res;
    }));
  };
};
for (var $__5 = methods[$traceurRuntime.toProperty(Symbol.iterator)](),
    $__6; !($__6 = $__5.next()).done; ) {
  $__7();
}
