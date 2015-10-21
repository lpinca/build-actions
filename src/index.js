'use strict';

import jsondiffpatch from 'jsondiffpatch';

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

}

//
// Expose the `buildActions` function.
//
export { buildActions as default };
