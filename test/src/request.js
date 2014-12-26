'use strict';

import sinon from 'sinon';
import express from 'express';
import Request from '../../src/request';
import Promise from 'bluebird';
import bodyParser from 'body-parser';

describe('A request', () => {
  var app, server, address, request, resource;

  beforeEach(done => {
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

  beforeEach(() => resource = {
    path: address,
    headers() {
      return { 'x-foo': 'bar' };
    },
    data() {
      return {
        foo: 'bar',
        bar: 'baz'
      };
    },
    notify: sinon.spy(function (name, ...args) {
      return Promise.resolve(args);
    })
  });

  beforeEach(() => request = new Request(resource));

  describe('given GET method', () => {
    beforeEach(() => {
      app.route('/').get((req, res) => {
        expect(req.get('x-foo')).to.equal('bar');
        expect(req).to.have.property('query').that.eql({
          foo: 'bar',
          bar: 'baz'
        });
        res.status(200).send('OK');
      });
    });

    it('should GET hostname/?foo=bar&bar=baz', () => {
      return request.get()
      .then(function (response) {
        expect(response.text).to.equal('OK');
        expect(resource.notify).to.have.been.calledTwice;
        expect(resource.notify).to.have.been.calledWith('request', resource);
      });
    });
  });

  for (let verb of ['post', 'put', 'patch']) {
    describe('given ' + verb.toUpperCase() + ' method', () => {
      beforeEach(() => {
        app.route('/')[verb]((req, res) => {
          expect(req.get('x-foo')).to.equal('bar');
          expect(req).to.have.property('body').that.eql({ foo: 'bar', bar: 'baz' });
          res.status(201).send('OK');
        });
      });

      it('should ' + verb.toUpperCase() + ' /some-path', () => {
        return request[verb]()
        .then(function (response) {
          expect(response.status).to.equal(201);
          expect(response.text).to.equal('OK');
          expect(resource.notify).to.have.been.calledTwice;
          expect(resource.notify).to.have.been.calledWith('request', resource);
        });
      });
    });
  }

  describe('given DELETE method', () => {
    beforeEach(() => {
      app.route('/').delete((req, res) => {
        expect(req.get('x-foo')).to.equal('bar');
        expect(req).to.have.property('query').that.eql({ foo: 'bar', bar: 'baz' });
        res.status(204).send();
      });
    });

    it('should DELETE hostname/?foo=bar&bar=baz', () => {
      return request.delete()
      .then(function (response) {
        expect(response.status).to.equal(204);
        expect(resource.notify).to.have.been.calledTwice;
        expect(resource.notify).to.have.been.calledWith('request', resource);
      });
    });
  });
});
