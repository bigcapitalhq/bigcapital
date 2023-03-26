// @ts-nocheck
import { createSelector } from 'reselect';
import { pickItemsFromIds } from '@/store/selectors';

const resourceDataIdsSelector = (state, props) => {
  return state.resources.data.resources[props.resourceName]?.order;
}
const resourceDataSelector = (state, props) => {
  return state.resources.data.resources[props.resourceName]?.data;
}

const resourceFieldsIdsSelector = (state, props) => state.resources.resourceFields[props.resourceName];
const resourceFieldsItemsSelector = (state) => state.resources.fields;

/**
 * Retrieve resource fields of the given resource slug.
 * @param {Object} state 
 * @param {String} resourceSlug 
 * @return {Array}
 */
export const getResourceFieldsFactory = () => createSelector(
  resourceFieldsIdsSelector,
  resourceFieldsItemsSelector,
  (fieldsIds, fieldsItems) => {
    return pickItemsFromIds(fieldsItems, fieldsIds);
  }
);

/**
 * Retrieve resource data of the given resource name in component properties.
 * @return {Array}
 */
export const getResourceDataFactory = () => createSelector(
  resourceDataSelector,
  resourceDataIdsSelector,
  (resourceData, resourceDataIds) => {
    return pickItemsFromIds(resourceData, resourceDataIds);   
  }
);

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


export const getResourceData = (state, resourceSlug) => {
  return state.resources.data[resourceSlug] || {};
};