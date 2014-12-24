'use strict';

/**
 * Capitalize given string.
 *
 * @param {String} str
 * @return {String}
 */

export var capitalize = (str) =>
	str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
