'use strict';

var express = require('express');
var request = require('../../src/request');
var bodyParser = require('body-parser');

describe('request', function () {
  var app, server, address, options;

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

  describe('given GET method', function () {
    beforeEach(function () {
      app.route('/').get(function (req, res) {
        expect(req.get('x-foo')).to.equal('bar');
        expect(req).to.have.property('query').that.eql({ foo: 'bar', bar: 'baz' });
        res.status(200).send('OK');
      });
    });

    beforeEach(function () {
      options.method = 'get';
    });

    it('should GET hostname/?foo=bar&bar=baz', function () {
      request(options)
      .then(function (response) {
        expect(response.text).to.equal('OK');
      });
    });
  });

  ['post', 'put', 'patch'].forEach(function (verb) {
    describe('given ' + verb.toUpperCase() + ' method', function () {
      beforeEach(function () {
        app.route('/')[verb](function (req, res) {
          expect(req.get('x-foo')).to.equal('bar');
          expect(req).to.have.property('body').that.eql({ foo: 'bar', bar: 'baz' });
          res.status(201).send('OK');
        });
      });

      beforeEach(function () {
        options.method = verb;
      });

      it('should ' + verb.toUpperCase() + ' /some-path', function () {
        return request(options)
        .then(function (response) {
          expect(response.text).to.equal('OK');
        });
      });
    });
  });

  describe('given DELETE method', function () {
    beforeEach(function () {
      app.route('/').delete(function (req, res) {
        expect(req.get('x-foo')).to.equal('bar');
        expect(req).to.have.property('query').that.eql({ foo: 'bar', bar: 'baz' });
        res.status(204).send();
      });
    });

    beforeEach(function () {
      options.method = 'delete';
    });

    it('should DELETE /some-path?', function () {
      return request(options);
    });
  });
});
