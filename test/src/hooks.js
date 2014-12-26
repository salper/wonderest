'use strict';

import Hooks from '../../src/hooks';
import Promise from 'bluebird';

describe('hooks', () => {
  var hooks, resource;

  describe('given top level resource', () => {
    beforeEach(() => resource = {});

    beforeEach(() => hooks = new Hooks(resource));

    it('should exec even if empty', () => hooks.exec('foo', []));

    describe('given hooks', () => {
      beforeEach(() => {
        hooks
          .add('foo', result => [result.concat('bar')])
          .add('foo', result => [result.concat('baz')]);
      });

      it('should add and execute hooks', () =>
        hooks.exec('foo', [[]])
          .then(result => expect(result).to.eql([['bar', 'baz']])));
    });
  });

  describe('given nth level resource', () => {
    beforeEach(() => resource = {
      parent: {
        notify: (name, result) => Promise.resolve([result.concat('parent')])
      }
    });

    beforeEach(() => hooks = new Hooks(resource));

    it('should exec even if empty', () =>
      hooks.exec('foo', [[]])
        .then(result => expect(result).eql([['parent']])));

    describe('given hooks', () => {
      beforeEach(() => {
        hooks
          .add('foo', result => [result.concat('bar')])
          .add('foo', result => [result.concat('baz')]);
      });

      it('should add and execute hooks', () =>
        hooks.exec('foo', [[]])
          .then(result => expect(result).eql([['parent', 'bar', 'baz']])));
    });
  });
});
