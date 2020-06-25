import { createSelector } from 'reselect';
import { pickItemsFromIds } from 'store/selectors';
import { getResourceColumn } from 'store/resources/resources.reducer';

const resourceViewsIdsSelector = (state, props, resourceName) =>
  state.views.resourceViews[resourceName] || [];

const viewsSelector = (state) => state.views.views;
const viewByIdSelector = (state, props) => state.views.viewsMeta[props.viewId] || {}; 

export const getResourceViews = createSelector(
  resourceViewsIdsSelector,
  viewsSelector,
  (resourceViewsIds, views) => {
    return pickItemsFromIds(views, resourceViewsIds);
  },
);

export const getViewMeta = (state, viewId) => {
  const view = { ...state.views.viewsMeta[viewId] } || {};

  if (view.columns) {
    view.columns = view.columns.map((column) => {
      return {
        ...getResourceColumn(state, column.field_id),
      };
    });
  }
  return view;
};

export const getViewItem = (state, viewId) => {
  return state.views.views[viewId] || {};
};

export const getViewPages = (resourceViews, viewId) => {
  return typeof resourceViews[viewId] === 'undefined'
    ? {}
    : resourceViews[viewId].pages;
};
