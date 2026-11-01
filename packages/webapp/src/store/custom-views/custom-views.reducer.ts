import { createReducer } from '@reduxjs/toolkit';
import type { CustomViewsState, CustomViewsAction } from './custom-views.types';
import {
  RESOURCE_VIEWS_SET,
  VIEW_ITEMS_SET,
  VIEW_META_SET,
} from '@/store/types';

const initialState: CustomViewsState = {
  views: {},
  resourceViews: {
    accounts: [],
    expenses: [],
  },
  viewsMeta: {},
};

export const customViewsReducer = createReducer(initialState, {
  [VIEW_META_SET]: (state, action: CustomViewsAction) => {
    if (action.view) {
      state.viewsMeta[action.view.id as string] = action.view;
    }
  },

  [RESOURCE_VIEWS_SET]: (state, action: CustomViewsAction) => {
    if (action.resource && action.views) {
      state.resourceViews[action.resource] = action.views.map((v) => v.id);
    }
  },

  [VIEW_ITEMS_SET]: (state, action: CustomViewsAction) => {
    const _views: Record<string, unknown> = {};

    (action.views ?? []).forEach((view) => {
      _views[view.id as string] = view;
    });
    state.views = { ...state.views, ..._views };
  },
});
