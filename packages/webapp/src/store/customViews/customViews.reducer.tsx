// @ts-nocheck
import { createReducer } from "@reduxjs/toolkit";
import t from '@/store/types';

const initialState = {
  views: {},
  resourceViews: {
    'accounts': [],
    'expenses': [],
  },
  viewsMeta: {},
};

export default createReducer(initialState, {
  [t.VIEW_META_SET]: (state, action) => {
    state.viewsMeta[action.view.id] = action.view;
  },

  [t.RESOURCE_VIEWS_SET]: (state, action) => {
    state.resourceViews[action.resource] = action.views.map(v => v.id);
  },

  [t.VIEW_ITEMS_SET]: (state, action) => {
    const _views = {};

    action.views.forEach((view) => {
      _views[view.id] = view;
    });
    state.views = { ...state.views, ..._views };
  },
})