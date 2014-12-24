'use strict';

import Resource from './resource';

/**
 * Client resource factory.
 *
 * @param {String} url
 * @return {Resource}
 */

export default url => new Resource(url);
