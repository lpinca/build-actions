'use strict';

const nameFields = new Set([
  'middleName',
  'firstName',
  'lastName',
  'title'
]);

const commonFields = new Set([
  'defaultShippingAddressId',
  'defaultBillingAddressId',
  'companyName',
  'dateOfBirth',
  'externalId',
  'vatId'
]);

//
// Expose the sets.
//
export { nameFields, commonFields };
