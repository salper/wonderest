"use strict";
'use strict';
Object.defineProperties(exports, {
  capitalize: {get: function() {
      return capitalize;
    }},
  __esModule: {value: true}
});
var capitalize = (function(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
});
