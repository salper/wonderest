'use strict';

import url from 'url';
import wrest from '../../src';
import methods from 'methods';
import express from 'express';
import bodyParser from 'body-parser';

describe('client', () => {
	let client;

	beforeEach(() => client = wrest('http://example.com'));

	it('should expose path', () => expect(client.path).to.equal('http://example.com'));
});

describe('client.resource', () => {
	var client;

	beforeEach(() => client = wrest('http://example.com').resource('api'));

	it('should resolve path', () => expect(client.path).to.equal('http://example.com/api'));
});

// for (let name of ['headers', 'data', 'options']) {
for (let name of ['headers']) {

	describe('client.' + name + '()', () => {
		let client;

		beforeEach(() => client = wrest());

		it('should set', () => {
			expect(client[name]('foo', 'bar')[name]('foo')).to.equal('bar');
			expect(client.resource('api')[name]('bar', 'baz')[name]('foo')).to.equal('bar');
		});

		it('should set all', () => {
			expect(client[name]({ 'foo': 'bar' })[name]()).to.eql({ foo: 'bar' });
			expect(client.resource('api')[name]('bar', 'baz')[name]()).to.eql({
				foo: 'bar',
				bar: 'baz'
			});
		});
	});

}

describe('client.request()', () => {
	var client;

	beforeEach(() => client = wrest());

	it('should implement available HTTP verbs', () => {
		for (let method of methods)
			expect(client.request()).to.have.property(method).that.is.instanceOf(Function);
	});
});

describe('client.request().get()', () => {
	var client, server, app;

	beforeEach((done) => {
		app = express();
		app.use(bodyParser.json());
		app.route('/api').get((req, res) => {
			expect(req.get('x-foo')).to.equal('bar');
			expect(req.query).to.eql({ bar: 'baz' });
			res.status(200).send('OK');
		});
		server = app.listen(0, function () {
			client = wrest(url.format({
				protocol: 'http',
				hostname: this.address().address,
				port: this.address().port
			}));
			done();
		});
	});

	afterEach(done => server.close(done));

	it('should GET http://0.0.0.0:$port/api?bar=baz', () => {
		return client.resource('api')
			.headers('x-foo', 'bar')
			.data('bar', 'baz')
			.request().get()
				.then((res) => {
					expect(res).to.have.property('status', 200);
					expect(res).to.have.property('text', 'OK');
				});
	});
});

describe('client.request().delete()', () => {
	var client, server, app;

	beforeEach((done) => {
		app = express();
		app.use(bodyParser.json());
		app.route('/api').delete((req, res) => {
			expect(req.get('x-foo')).to.equal('bar');
			expect(req.query).to.eql({ bar: 'baz' });
			res.status(204).send();
		});
		server = app.listen(0, function () {
			client = wrest(url.format({
				protocol: 'http',
				hostname: this.address().address,
				port: this.address().port
			}));
			done();
		});
	});

	afterEach(done => server.close(done));

	it('should DELETE http://0.0.0.0:$port/api?bar=baz', () => {
		return client.resource('api')
			.headers('x-foo', 'bar')
			.data('bar', 'baz')
			.request().delete()
				.then((res) => expect(res).to.have.property('status', 204));
	});
});

for (let method of ['post', 'patch', 'put']) {

	describe('client.request().' + method + '()', () => {
		var client, server, app;

		beforeEach((done) => {
			app = express();
			app.use(bodyParser.json());
			app.route('/api')[method]((req, res) => {
				expect(req.get('x-foo')).to.equal('bar');
				expect(req.body).to.eql({ bar: 'baz' });
				res.status(201).send('OK');
			});
			server = app.listen(0, function () {
				client = wrest(url.format({
					protocol: 'http',
					hostname: this.address().address,
					port: this.address().port
				}));
				done();
			});
		});

	 	afterEach(done => server.close(done));

		it(method.toUpperCase() + ' http://0.0.0.0:$port/api', () => {
			return client.resource('api')
				.headers('x-foo', 'bar')
				.data('bar', 'baz')
				.request()[method]()
					.then((res) => {
						expect(res).to.have.property('status', 201);
						expect(res).to.have.property('text', 'OK');
					});
		});
	});

}

describe('client.hook()', () => {
	var client, server, app;

	beforeEach((done) => {
		app = express();
		app.use(bodyParser.json());
		app.route('/token').get((req, res) => res.status(200).send('token'));
		app.route('/api').get((req, res) => {
			if (! req.get('Authorization'))
				return res.status(403).send();

			expect(req.get('Authorization')).to.equal('token');
			res.status(200).send('OK');
		});
		server = app.listen(0, function () {
			client = wrest(url.format({
				protocol: 'http',
				hostname: this.address().address,
				port: this.address().port
			}))
			.hook('response', (resource, res, retry) => {
				if (200 === res.status)
					return [resource, res, retry];

				return resource.client.resource('token').request().get()
					.tap((res) => resource.client.headers('Authorization', res.text))
					.then(() => retry())
					.then(res => [ resource, res, retry]);
			});
			done();
		});
	});

	afterEach(done => server.close(done));

	it('should be called properly', () => {
		return client.resource('api')
			.headers('x-foo', 'bar')
			.data('bar', 'baz')
			.request().get()
				.then((res) => {
					expect(res).to.have.property('status', 200);
					expect(res).to.have.property('text', 'OK');
				});
	});
});
