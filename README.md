Wonderest
=========

[![Build Status][status]](https://travis-ci.org/salper/wonderest)
[![Dependency Status][deps]](https://david-dm.org/salper/wonderest)
[![devDependency Status][devdeps]](https://david-dm.org/salper/wonderest#info=devDependencies)

[status]: https://travis-ci.org/salper/wonderest.svg?branch=master
[deps]: https://david-dm.org/salper/wonderest.svg?theme=shields.io
[devdeps]: https://david-dm.org/salper/wonderest/dev-status.svg?theme=shields.io

A REST client with fluent interface

# Requirements
Node must be run with the harmony flag:

```shell
node --harmony app.js
```

# Example

```javascript
var wrest = require('wonderest');

wrest({ url: 'http://example.org/api' }).get()
// => GET http://example.org/api
.then(function(res) {
  console.log(res.text;
});

wrest({ url: 'http://example.org/api' })users.get()
// => GET http://example.org/api/users
.then(function(res) {
  console.log(res.text;
});

wrest({ url: 'http://example.org/api' })users(1).get()
// => GET http://example.org/api/users/1
.then(function(res) {
  console.log(res.text;
});
```

# API

### wrest(options)
```javascript
var client = wrest({
  url: 'http://example.org/api', // API endpoint
  headers: {}, // Default headers
  data: {}, // default data (query or body depending on the HTTP verb
});
// => return a resource
```

### Resource
```javascript
resource.path; // => chained resource path
resource.options; // constructed options
resource.get(headers, data); // execute a PUT request
resource.post(headers, data); // execute a POST request
// etc.
```

# Licence
MIT
