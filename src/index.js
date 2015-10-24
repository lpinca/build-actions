'use strict';

import { nameFields, commonFields } from './fields';
import jsondiffpatch from 'jsondiffpatch';

const diffpatch = jsondiffpatch.create({ objectHash: (obj) => obj.id });

/**
 * Calculates the differences between two customer objects and builds the update
 * actions.
 *
 * @public
 * @param {Object} before Original customer
 * @param {Object} after Updated customer
 * @return {Array} Update actions
 */
function buildActions(before, after) {
  const changes = diffpatch.diff(before, after) || {};
  const actions = [];
  let changeName;

  Object.keys(changes).forEach((key) => {
    const change = changes[key];

    if (nameFields.has(key)) {
      //
      // Create and append the action if we don't have one (the `firstName`
      // and `lastName` fields can not be removed).
      //
      if (!changeName) {
        changeName = {
          firstName: before.firstName,
          lastName: before.lastName,
          action: 'changeName'
        };
        actions.push(changeName);
      }

      if (change.length !== 3) changeName[key] = after[key];
    } else if (key === 'email') {
      //
      // This `email` field can not be removed.
      //
      actions.push({ action: 'changeEmail', email: change[1] });
    } else if (key === 'addresses') {
      Object.keys(change).forEach((key) => {
        //
        // This property has no special meaning for us.
        //
        if (key === '_t') return;

        const delta = change[key];

        //
        // The address has been moved or removed.
        //
        if (key.charAt(0) === '_') {
          if (!delta[2]) {
            actions.push({ action: 'removeAddress', addressId: delta[0].id });
          }
          return;
        }

        //
        // The address has been changed or inserted.
        //
        if (Array.isArray(delta)) {
          actions.push({ action: 'addAddress', address: delta[0] });
        } else {
          actions.push({
            addressId: after.addresses[key].id,
            address: after.addresses[key],
            action: 'changeAddress'
          });
        }
      });
    } else if (key === 'customerGroup') {
      const action = { action: 'setCustomerGroup' };

      if (!Array.isArray(change) || change.length === 1) {
        action.customerGroup = after.customerGroup;
      }

      actions.push(action);
    } else if (key === 'customerNumber') {
      //
      // This field can be set only once.
      //
      if (change.length === 1) {
        actions.push({
          action: 'setCustomerNumber',
          customerNumber: change[0]
        });
      }
    } else if (commonFields.has(key)) {
      let actionName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
      let prop = key;

      if (
          key === 'defaultShippingAddressId'
        || key === 'defaultBillingAddressId'
      ) {
        actionName = actionName.slice(0, -2);
        prop = 'addressId';
      }

      const action = { action: actionName };

      if (change.length !== 3) action[prop] = after[key];

      actions.push(action);
    } else if (key === 'custom') {
      const fields = after.custom && after.custom.fields;
      let action = { action: 'setCustomType' };

      //
      // The custom type has been added or removed.
      //
      if (Array.isArray(change)) {
        if (change.length === 1) {
          action.typeId = after.custom.type.id;
          if (fields) action.fields = fields;
        }

        return actions.push(action);
      }

      if (change.type) {
        //
        // The `type` field has changed. We have to set the new custom type.
        //
        action.typeId = after.custom.type.id;
        if (fields) action.fields = fields;
        actions.push(action);
      } else {
        Object.keys(change.fields).forEach((key) =>{
          const delta = change.fields[key];

          action = { action: 'setCustomField', name: key };

          if (!Array.isArray(delta) || delta.length !== 3) {
            action.value = after.custom.fields[key];
          }

          actions.push(action);
        });
      }
    }
  });

  return actions;
}

//
// Expose the `buildActions` function.
//
export { buildActions as default };
