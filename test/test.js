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

  it('builds the actions for the addresses', () => {
    const before = clone(customer);
    const after = clone(customer);

    before.addresses.push({
      id: '-FedBtG1',
      country: 'IT'
    }, {
      id: 'c8iHxWpT',   // Removed.
      country: 'DE'
    }, {
      id: 'FjAJrc2C',
      country: 'NL'
    });

    after.addresses.push({
      id: 'FjAJrc2C',
      country: 'NL'
    }, {
      id: '-FedBtG1',   // Edited and moved.
      country: 'GB',
      city: 'London'
    }, {
      country: 'FR'   // Added.
    });

    expect(buildActions(before, after).sort((a, b) => {
      return a.action.localeCompare(b.action);
    })).to.deep.equal([{
      action: 'addAddress',
      address: { country: 'FR' }
    }, {
      action: 'changeAddress',
      addressId: '-FedBtG1',
      address: {
        id: '-FedBtG1',
        country: 'GB',
        city: 'London'
      }
    }, {
      action: 'removeAddress',
      addressId: 'c8iHxWpT'
    }]);
  });

  it('builds the `setCustomerGroup` action', () => {
    const groupOne = {
      id: 'cee877ae-da98-4566-a0f7-cc9d56341fe4',
      typeId: 'customer-group'
    };
    const groupTwo = {
      id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
      typeId: 'customer-group'
    };
    const action = 'setCustomerGroup';
    const one = clone(customer);
    const two = clone(customer);

    one.customerGroup = groupOne;
    two.customerGroup = groupTwo;

    expect(buildActions(customer, one)).to.deep.equal([{
      customerGroup: groupOne,
      action: action
    }]);

    expect(buildActions(one, customer)).to.deep.equal([{
      action: action
    }]);

    expect(buildActions(one, two)).to.deep.equal([{
      customerGroup: groupTwo,
      action: action
    }]);
  });

  it('builds the `setCustomerNumber` action', () => {
    const one = clone(customer);
    const two = clone(customer);

    one.customerNumber = '123456';
    two.customerNumber = '654321';

    expect(buildActions(customer, one)).to.deep.equal([{
      customerNumber: one.customerNumber,
      action: 'setCustomerNumber'
    }]);

    expect(buildActions(one, customer)).to.be.empty;
    expect(buildActions(one, two)).to.be.empty;
  });

  [
    'setDefaultShippingAddress',
    'setDefaultBillingAddress'
  ].forEach((action) => {
    it(`builds the \`${action}\` action`, () => {
      const key = action.charAt(3).toLowerCase() + action.slice(4) + 'Id';
      const one = clone(customer);
      const two = clone(customer);

      one[key] = 'FjAJrc2C';
      two[key] = 'c8iHxWpT';

      expect(buildActions(customer, one)).to.deep.equal([{
        addressId: one[key],
        action: action
      }]);

      expect(buildActions(one, customer)).to.deep.equal([{
        action: action
      }]);

      expect(buildActions(one, two)).to.deep.equal([{
        addressId: two[key],
        action: action
      }]);
    });
  });

  it('builds the `setExternalId` action', () => {
    const action = 'setExternalId';
    const one = clone(customer);
    const two = clone(customer);

    one.externalId = '123456';
    two.externalId = '654321';

    expect(buildActions(customer, one)).to.deep.equal([{
      externalId: one.externalId,
      action: action
    }]);

    expect(buildActions(one, customer)).to.deep.equal([{
      action: action
    }]);

    expect(buildActions(one, two)).to.deep.equal([{
      externalId: two.externalId,
      action: action
    }]);
  });

  it('builds the `setCompanyName` action', () => {
    const action = 'setCompanyName';
    const one = clone(customer);
    const two = clone(customer);

    one.companyName = 'Acme Corporation';
    two.companyName = 'Globex Corporation';

    expect(buildActions(customer, one)).to.deep.equal([{
      companyName: one.companyName,
      action: action
    }]);

    expect(buildActions(one, customer)).to.deep.equal([{
      action: action
    }]);

    expect(buildActions(one, two)).to.deep.equal([{
      companyName: two.companyName,
      action: action
    }]);
  });

  it('builds the `setDateOfBirth` action', () => {
    const action = 'setDateOfBirth';
    const one = clone(customer);
    const two = clone(customer);

    one.dateOfBirth = '1980-01-01';
    two.dateOfBirth = '1983-01-01';

    expect(buildActions(customer, one)).to.deep.equal([{
      dateOfBirth: one.dateOfBirth,
      action: action
    }]);

    expect(buildActions(one, customer)).to.deep.equal([{
      action: action
    }]);

    expect(buildActions(one, two)).to.deep.equal([{
      dateOfBirth: two.dateOfBirth,
      action: action
    }]);
  });

  it('builds the `setVatId` action', () => {
    const action = 'setVatId';
    const one = clone(customer);
    const two = clone(customer);

    one.vatId = 'DE999999999';
    two.vatId = 'DE888888888';

    expect(buildActions(customer, one)).to.deep.equal([{
      vatId: one.vatId,
      action: action
    }]);

    expect(buildActions(one, customer)).to.deep.equal([{
      action: action
    }]);

    expect(buildActions(one, two)).to.deep.equal([{
      vatId: two.vatId,
      action: action
    }]);
  });

  it('builds the `setCustomType` action', () => {
    const action = 'setCustomType';
    const one = clone(customer);
    const fields = {
      phoneNumber: '111223344',
      gender: 'male'
    };

    one.custom = {
      type: {
        typeId: 'type',
        id: '823b55b7-1ac0-4c39-a21d-843aad1ef755'
      }
    };

    expect(buildActions(customer, one)).to.deep.equal([{
      typeId: one.custom.type.id,
      action: action
    }]);

    one.custom.fields = fields;

    expect(buildActions(customer, one)).to.deep.equal([{
      typeId: one.custom.type.id,
      fields: fields,
      action: action
    }]);

    expect(buildActions(one, customer)).to.deep.equal([{
      action: action
    }]);

    const two = clone(one);
    two.custom.type.id = '123e4567-e89b-12d3-a456-426655440000';

    expect(buildActions(one, two)).to.deep.equal([{
      typeId: two.custom.type.id,
      fields: fields,
      action: action
    }]);

    delete two.custom.fields;

    expect(buildActions(one, two)).to.deep.equal([{
      typeId: two.custom.type.id,
      action: action
    }]);
  });

  it('builds the `setCustomField` action', () => {
    const action = 'setCustomField';
    const one = clone(customer);

    one.custom = {
      type: {
        typeId: 'type',
        id: '823b55b7-1ac0-4c39-a21d-843aad1ef755'
      },
      fields: {
        phoneNumber: '111223344',
        faxNumber: '443322111'
      }
    };

    const two = clone(one);

    two.custom.fields.phoneNumber = '112233';
    delete two.custom.fields.faxNumber;
    two.custom.fields.gender = {
      de: 'männlich',
      en: 'male'
    };

    const expected = [{
      name: 'faxNumber',
      action: action
    }, {
      value: two.custom.fields.gender,
      action: action,
      name: 'gender'
    }, {
      value: two.custom.fields.phoneNumber,
      name: 'phoneNumber',
      action: action
    }];

    expect(buildActions(one, two).sort((a, b) => {
      return a.name.localeCompare(b.name);
    })).to.deep.equal(expected);

    one.custom.fields.gender = {
      it: 'maschio',
      en: 'male'
    }

    expect(buildActions(one, two).sort((a, b) => {
      return a.name.localeCompare(b.name);
    })).to.deep.equal(expected);
  });
});
