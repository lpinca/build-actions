'use strict';

import buildActions from '../src/index';
import { expect } from 'chai';

describe('buildActions', () => {
  it('is exported as a function', () => {
    expect(buildActions).to.be.a('function');
  });
});
