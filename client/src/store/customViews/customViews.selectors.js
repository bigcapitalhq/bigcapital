import {pickItemsFromIds} from 'store/selectors';
import {getResourceColumn } from 'store/resources/resources.reducer';

export const getResourceViews = (state, resourceName) => {
  const resourceViewsIds = state.views.resourceViews[resourceName] || [];
  return pickItemsFromIds(state.views.views, resourceViewsIds);
};

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
  return (typeof resourceViews[viewId] === 'undefined') ? 
    {} : resourceViews[viewId].pages;
};