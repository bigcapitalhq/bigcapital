import { createReducer } from "@reduxjs/toolkit";
import t from 'store/types';
import { pickItemsFromIds } from 'store/selectors'

const initialState = {
  fields: {},
  columns: {},
  resourceFields: {},
  resourceColumns: {},

  metadata: {
    'accounts': {
      label: 'Accounts',
      baseRoute: '/accounts',
    },
    'items': {
      label: 'Items',
      baseRoute: '/items',
    },
    'manual_journals': {
      label: 'Journals',
      baseRoute: '/manual-journals',
    }
  }
};

export default createReducer(initialState, {
  [t.RESOURCE_COLUMNS_SET]: (state, action) => {
    const _columns = {};
    
    action.columns.forEach((column) => {
      _columns[column.id] = column;
    });
    state.columns = {
      ...state.columns,
      ..._columns,
    };
    state.resourceColumns[action.resource_slug] = action.columns.map(c => c.id);
  },

  [t.RESOURCE_FIELDS_SET]: (state, action) => {
    const _fields = {};
    
    action.fields.forEach((field) => {
      _fields[field.id] = field;
    });
    state.fields = {
      ...state.fields,
      ..._fields,
    };
    state.resourceFields[action.resource_slug] = action.fields.map(f => f.id);
  },
});

/**
 * Retrieve resource fields of the given resource slug.
 * @param {Object} state 
 * @param {String} resourceSlug 
 * @return {Array}
 */
export const getResourceFields = (state, resourceSlug) => {
  const resourceIds = state.resources.resourceFields[resourceSlug];
  const items = state.resources.fields;
  return pickItemsFromIds(items, resourceIds);
};

/**
 * Retrieve resource columns of the given resource slug.
 * @param {State} state 
 * @param {String} resourceSlug -
 * @return {Array}
 */
export const getResourceColumns = (state, resourceSlug) => {
  const resourceIds = state.resources.resourceColumns[resourceSlug];
  const items = state.resources.columns;
  return pickItemsFromIds(items, resourceIds);
};

/**
 * 
 * @param {State} state 
 * @param {Number} fieldId 
 */
export const getResourceField = (state, fieldId) => {
  return state.resources.fields[fieldId];
};

/**
 * 
 * @param {State} state 
 * @param {Number} columnId 
 */
export const getResourceColumn = (state, columnId) => {
  return state.resources.columns[columnId];
};

export const getResourceMetadata = (state, resourceSlug) => {
  return state.resources.metadata[resourceSlug];
};