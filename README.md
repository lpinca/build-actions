# build-actions

[![Version npm][npm-build-actions-badge]][npm-build-actions]
[![Build Status][travis-build-actions-badge]][travis-build-actions]
[![Coverage Status][coverage-build-actions-badge]][coverage-build-actions]

Calculate the differences between two customer objects and build the update
actions as defined in [http://dev.sphere.io/http-api-projects-customers.html][customer].

## Install

```bash
npm install --save build-actions
```

## API

This module exports a single function that takes two arguments:

1. An object representing a customer.
2. An object representing the updated version of the same customer.

The function returns an array of [update actions][update-actions].

```js
var buildActions = require('build-actions');

var before = {
  email: 'foo.bar@domain.com',
  firstName: 'foo',
  lastName: 'bar',
  addresses: []
};

var after = {
  customerNumber: '123456',
  email: 'foobar@domain.com',
  firstName: 'foo',
  lastName: 'bar',
  middleName: 'baz',
  addresses: [{
    id: 'FjAJrc2C',
    country: 'NL'
  }],
  defaultShippingAddressId: 'FjAJrc2C'
};

var actions = buildActions(before, after);

console.log(actions);

/*
[{
  action: 'changeEmail',
  email: 'foobar@domain.com'
}, {
  action: 'addAddress',
  address: {
    id: 'FjAJrc2C',
    country: 'NL'
  }
}, {
  action: 'setCustomerNumber',
  customerNumber: '123456'
}, {
  action: 'changeName',
  firstName: 'foo',
  lastName: 'bar',
  middleName: 'baz'
}, {
  action: 'setDefaultShippingAddress',
  addressId: 'FjAJrc2C'
}]
*/
```

## License

[MIT](LICENSE)

[npm-build-actions-badge]: https://img.shields.io/npm/v/build-actions.svg
[npm-build-actions]: https://www.npmjs.com/package/build-actions
[travis-build-actions-badge]: https://img.shields.io/travis/lpinca/build-actions/master.svg
[travis-build-actions]: https://travis-ci.org/lpinca/build-actions
[coverage-build-actions-badge]: https://img.shields.io/coveralls/lpinca/build-actions/master.svg
[coverage-build-actions]: https://coveralls.io/r/lpinca/build-actions?branch=master
[customer]: http://dev.sphere.io/http-api-projects-customers.html
[update-actions]: http://dev.sphere.io/http-api-projects-customers.html#update-actions
