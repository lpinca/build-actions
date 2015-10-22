'use strict';

import customer from './fixture/customer';
import buildActions from '../src/index';
import clone from 'lodash.clonedeep';
import { expect } from 'chai';

describe('buildActions', () => {
  it('is exported as a function', () => {
    expect(buildActions).to.be.a('function');
  });

  it('returns an empty array if there are no changes', () => {
    expect(buildActions(customer, customer)).to.deep.equal([]);
  });

  it('builds the `changeName` action', () => {
    const before = clone(customer);
    const after = clone(customer);

    after.middleName = 'qux';
    after.firstName = 'baz';
    before.title = 'Mr.';

    expect(buildActions(before, after)).to.deep.equal([{
      action: 'changeName',
      middleName: after.middleName,
      firstName: after.firstName,
      lastName: 'bar'
    }]);
  });

  it('builds the `changeEmail` action', () => {
    const after = clone(customer);

    after.email = 'foobar@domain.com';

    expect(buildActions(customer, after)).to.deep.equal([{
      action: 'changeEmail',
      email: after.email
    }]);
  });
});
