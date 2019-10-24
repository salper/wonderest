:no_entry: [DEPRECATED] Wonderest
=========

[![Build Status][status]](https://travis-ci.org/salper/wonderest)
[![Dependency Status][deps]](https://david-dm.org/salper/wonderest)
[![devDependency Status][devdeps]](https://david-dm.org/salper/wonderest#info=devDependencies)

[status]: https://travis-ci.org/salper/wonderest.svg?branch=master
[deps]: https://david-dm.org/salper/wonderest.svg?theme=shields.io
[devdeps]: https://david-dm.org/salper/wonderest/dev-status.svg?theme=shields.io

Wonderest is a wrapper around [superagent](https://github.com/visionmedia/superagent), allowing to configure endpoints bit by bit using a chainable API.

# Requirements
Wonderest is written in ES6, compiled in ES5 using [traceur](https://github.com/google/traceur-compiler), and requires traceur-runtime to be loaded.

```shell
require('traceur/bin/traceur-runtime');
var wrest = require('wonderest');
```

# Example

```javascript
var wrest = require('wonderest');

// GET http://example.org/api
wrest('http://example.org/api')
  .request().get().then(function(res) {
    console.log(res.text);
  });

// GET http://example.org/api
wrest('http://example.org').resource('api')
  .request().get().then(function(res) {
    console.log(res.text;
  });

// GET http://example.org/api?limit=10&offset=1
wrest('http://example.org').data('limit', 10)
    .resource('api').data('offset', 1)
      .request().get().then(function (res) {
        console.log(res.text);
      });
```

# API

### wrest(url)
Wonderest client factory. A client is a top level resource, thus it exposes the same API as sub resources.

```javascript
var wrest = require('wonderest');
var client = wrest('http://example.com');
```

### Resource.path
The path of the resource is dynamically resolved and returned.

```javascript
wrest('http://example.com').resource('api').resource('users').path;
// => http://example.com/api/users
```

### Resource.parent
The resource parent if any. A client has not parent.

```javascript
wrest('http://example.com').resource('api').resource('users').parent.path;
// => http://example.com/api
```

### Resource.client
The top level resource.

```javascript
wrest('http://example.com').resource('api').resource('users').client.path;
// => http://example.com
```

### Resource.resource(path)
Sub resource factory.

```javascript
wrest('http://example.com').resource('api').path;
// => http://example.com/api
```

### Resource.headers()
Sets or gets resource headers (dynamically resolved).

```javascript
var client = wrest('http://example.com');

client.headers()
// => {}

client.headers({ foo: 'bar' }).headers();
// => { foo: 'bar' }

client.headers('foo');
// => 'bar'

client.resource('api').headers('bar', 'baz').headers();
// => { foo: 'bar', bar => 'baz' }
```

### Resource.data()
Sets or gets resource data (dynamically resolved). Depending on the request verb (GET, POST, PUT, etc.), data is used as request query or body.

```javascript
var client = wrest('http://example.com');

client.data()
// => {}

client.data({ foo: 'bar' }).data();
// => { foo: 'bar' }

client.data('foo');
// => 'bar'

client.resource('api').data('bar', 'baz').data();
// => { foo: 'bar', bar => 'baz' }
```

### Resource.options()
Sets or gets resource options (dynamically resolved). There are no options currently used by wonderest, it is more a placeholder for some applicative options, like authentication credentials, which can be used in request hooks.

```javascript
var client = wrest('http://example.com');

client.options()
// => {}

client.options({ foo: 'bar' }).options();
// => { foo: 'bar' }

client.options('foo');
// => 'bar'

client.resource('api').options('bar', 'baz').options();
// => { foo: 'bar', bar => 'baz' }
```

### Resource.request()
Request factory. Implements available HTTP verbs - see [methods](https://github.com/jshttp/methods)

```javascript
wrest('http://example.com').request().post(data, headers).then(function (res) {
  // ...
});
```

### Resource.hook(name, handler)
Hook registrar. Wonderest provides two hooks per request (_request_ and _response_). _request_ is executed before delegating to superagent, and _response_ is executed after superagent response.

The order of execution is from the client to the resource (top to bottom), and handlers must return the same positional arguments as they were given in an array form (to allow spreading).

```javascript
// Example of authenticated API.

var client = wrest('http://example.com/api');

client.hook('request', function (resource) {
  // ...
  return [resource];
});

client.hook('response', function (resource, res, retry) {
  if (403 !== res.status)
    return [].slice.call(arguments);

  return resource.client.resource('authenticate')
    .data(resource.options('authentication'))
    .request().post()
    .tap(function (res) {
      resource.headers('Authorization', res.text);
    })
    .then(function () {
      return retry();
    })
    .then(function (res) {
      return [resource, res, retry];
    });
});

client.resource('users').request().get().then(function (res) {
  console.log(res.text);
});

```

# Licence
MIT
