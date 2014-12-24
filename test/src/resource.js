'use strict';

import Resource from '../../src/resource';

describe('resource.client', () => {
  let client, resource;

  beforeEach(() => client = new Resource());

  beforeEach(() => resource = new Resource('', client));

  it('should return client', () => expect(resource).to.have.property('client', client));
});
