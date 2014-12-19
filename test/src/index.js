'use strict';

var wrest = require('../..');
var methods = require('methods');

describe('wonderest', function () {
  var client;

  beforeEach(function () {
    client = wrest({
      url: 'http://example.com',
      headers: {
        'x-foo': 'bar'
      },
      data: {
        foo: 'bar',
        bar: 'baz'
      }
    });
  });

  it('should instanciate a proxyfied resource', function () {
    expect(client).to.have.property('path', '');
    expect(client).to.have.property('opt').that.eql({
      url: 'http://example.com',
      headers: {
        'x-foo': 'bar'
      },
      data: {
        foo: 'bar',
        bar: 'baz'
      }
    });

    methods.forEach(function (name) {
      expect(client).to.have.property(name).that.is.instanceOf(Function);
    });
  });
});
