import { createReducer } from "@reduxjs/toolkit";
import t from 'store/types';

const initialState = {
  resourceFields: {
    // resource name => { field_id }
  },
  resourceColumns: {},
};

export default createReducer(initialState, {
  [t.RESOURCE_COLUMNS_SET]: (state, action) => {
    state.resourceColumns[action.resource_slug] = action.columns;
  },

  [t.RESOURCE_FIELDS_SET]: (state, action) => {
    state.resourceFields[action.resource_slug] = action.fields;
  },
})

/**
 * Retrieve resource fields of the given resource slug.
 * @param {Object} state 
 * @param {String} resourceSlug 
 */
export const getResourceFields = (state, resourceSlug) => {
  const resourceFields = state.resources.resourceFields[resourceSlug];
  return resourceFields ? Object.values(resourceFields) : [];
}

/**
 * Retrieve resource columns of the given resource slug.
 * @param {State} state 
 * @param {String} resourceSlug -
 */
export const getResourceColumns = (state, resourceSlug) => {
  const resourceColumns = state.resources.resourceColumns[resourceSlug];
  return resourceColumns ? Object.values(resourceColumns) : [];
}