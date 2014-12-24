/* jshint loopfunc: true */
'use strict';

import R from 'ramda';
import request from 'superagent';
import methods from 'methods';
import Promise from 'bluebird';

/**
 * Module interface.
 */

export default Request;

/**
 * Request constructor.
 *
 * @param {Resource} resource
 */

function Request(resource) {
	this._resource = resource;
}

Request.prototype = {

	/**
	 * Execute request hooks.
	 *
	 * @return {Promise}
	 * @private
	 */

	_exectRequestHook() {
		return this._resource.notify('request', this._resource);
	},

	/**
	 * Execute response hooks.
	 *
	 * @param {Response} res
	 * @param {Function} retry
	 * @return {Promise}
	 * @private
	 */

	_execResponseHook(res, retry) {
		return this._resource.notify('response', this._resource, res, retry);
	},

	/**
	 * Send a request using provided data and resource data.
	 *
	 * @param {String} method - HTTP verb
	 * @param {Object=} data
	 * @param {Object=} headers
	 * @return {Promise}
	 * @private
	 */

	_send(method, data, headers) {
		let request = this._createRequest(
			'delete' === method ? 'del' : method,
			R.mixin(this._resource.data(), data || {}),
			R.mixin(this._resource.headers(), headers || {})
		);

		return Promise.promisify(request.end.bind(request))();
	},

	/**
	 * Create and return superagent request.
	 *
	 * @param {String} method - HTTP verb
	 * @param {Object=} data
	 * @param {Object=} headers
	 * @return {SuperAgent}
	 * @private
	 */

	_createRequest(method, data, headers) {
		return request[method](this._resource.path).set(headers)[
			['post', 'put', 'patch'].indexOf(method) >= 0 ? 'send' : 'query'
		](data);
	}
};

/**
 * Iterate on HTTP verbs and create helper methods.
 *
 * @param {Object=} data
 * @param {Object=} headers
 * @param {Promise}
 */

for (let method of methods)
	Request.prototype[method] = function (data, headers) {
		let retry = () => this._send(method, data, headers);

		return this._exectRequestHook()
			.then(() => retry())
			.then(res => this._execResponseHook(res, retry))
			.spread((resource, res) => res);
	};
