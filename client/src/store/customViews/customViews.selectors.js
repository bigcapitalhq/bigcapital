import {pickItemsFromIds} from 'store/selectors';


export const getResourceViews = (state, resourceName) => {
  const resourceViewsIds = state.views.resourceViews[resourceName] || [];
  return pickItemsFromIds(state.views.views, resourceViewsIds);
};

export const getViewMeta = (state, viewId) => {
  return state.views.viewsMeta[viewId] || {};
};

export const getViewItem = (state, viewId) => {
  return state.views.views[viewId] || {};
};