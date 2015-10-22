'use strict';

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
  const nameFields = [
    'middleName',
    'firstName',
    'lastName',
    'title'
  ];
  const actions = [];

  Object.keys(changes).forEach((key) => {
    const change = changes[key];

    if (~nameFields.indexOf(key)) {
      //
      // Here we assume that the new object is validated, so if there is a
      // difference in the `firstName` or `lastName` field, this difference
      // must consist in a different non empty string.
      //
      let action = actions.find((action) => {
        return action.action === 'changeName' ? true : false;
      });

      //
      // Create and append the action if we can't find one.
      //
      if (!action) {
        action = {
          firstName: before.firstName,
          lastName: before.lastName,
          action: 'changeName'
        };
        actions.push(action);
      }

      if (change.length === 1) {
        action[key] = change[0];
      } else if (change.length === 2) {
        action[key] = change[1];
      }
    } else if (key === 'email') {
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
    }
  });

  return actions;
}

//
// Expose the `buildActions` function.
//
export { buildActions as default };
