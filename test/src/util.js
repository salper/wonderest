'use strict';

import {capitalize} from '../../src/util';

describe('Capitalize', () =>
  it('should capitalize string', () =>
    expect(capitalize('toKeN')).to.equal('Token')));
