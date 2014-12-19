/* global Proxy:true */
'use strict';

var R = require('ramda');
var express = require('express');
var handler = require('../../src/handler');
var resource = require('../../src/resource');
var bodyParser = require('body-parser');

describe('proxyfied resource', function () {
  var proxy, methods = ['get', 'post', 'put', 'patch', 'delete'];

  describe('given no arguments', function () {
    beforeEach(function () {
      proxy = new Proxy(resource(), handler);
    });

    it('should construct', function () {
      expect(proxy).to.be.instanceOf(Function);
      expect(proxy.path).to.equal('');
      expect(proxy.opt).to.eql({});
      methods.forEach(function (name) {
        expect(proxy[name]).to.be.instanceOf(Function);
      });
    });
  });

  describe('given arguments', function () {
    var server, app, address, options;

    beforeEach(function (done) {
      app = express();
      app.use(bodyParser.json());
      server = app.listen(0, function () {
        address = require('url').format({
          protocol: 'http',
          hostname: this.address().address,
          port: this.address().port
        });
        done();
      });
    });

    afterEach(function (done) {
      server.close(done);
    });

    beforeEach(function () {
      options = {
        url: address,
        headers: {
          'x-foo': 'bar'
        },
        data: {
          foo: 'bar',
          bar: 'baz'
        }
      };
    });

    beforeEach(function () {
      proxy = new Proxy(resource('api', options), handler);
    });

    it('should construct', function () {
      expect(proxy.path).to.equal('api');
      expect(proxy.opt).to.equal(options);
    });

    it('should chain', function () {
      expect(proxy.users).to.have.property('path').that.equal('api/users');
      expect(proxy.users(1)).to.have.property('path').that.equal('api/users/1');
    });

    ['get', 'delete'].forEach(function (name) {
      describe('calling ' + name + ' method', function () {
        beforeEach(function () {
          app.route('/api/users/:id')[name](function (req, res) {
            expect(req).to.have.property('query').that.eql({ foo: 'bar', bar: 'baz' });
            res.status(200).send('OK');
          });
        });

        it('should ' + name, function () {
          return proxy.users(1)[name]()
          .then(function (response) {
            expect(response).to.have.property('text', 'OK');
          });
        });
      });
    });

    R.difference(methods, ['get', 'delete']).forEach(function (name) {
      describe('calling ' + name + ' method', function () {
        beforeEach(function () {
          app.route('/api/users/:id')[name](function (req, res) {
            expect(req).to.have.property('body').that.eql({ foo: 'bar', bar: 'baz' });
            res.status(200).send('OK');
          });
        });

        it('should ' + name, function () {
          return proxy.users(1)[name]()
          .then(function (response) {
            expect(response).to.have.property('text', 'OK');
          });
        });
      });
    });
  });
});
