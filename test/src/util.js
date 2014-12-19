'use strict';

var explode = require('../../src/util').explode;

describe('util', function () {
  describe('explode', function () {
    var object;

    describe('given undefined value', function () {
      it('should part as empty', function () {
        expect(explode(object)).to.eql([]);
      });
    });

    describe('given empty value', function () {
      beforeEach(function () {
        object = {};
      });

      it('should part as empty', function () {
        expect(explode(object)).to.eql([]);
      });
    });

    describe('given filled value', function () {
      beforeEach(function () {
        object = { a: 'b', c: 'd'};
      });

      it('should part as empty', function () {
        expect(explode(object)).to.eql([{ a: 'b' }, { c: 'd' }]);
      });
    });
  });
});