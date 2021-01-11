import { createReducer } from '@reduxjs/toolkit';
import {
  viewPaginationSetReducer,
  createTableQueryReducers,
} from 'store/journalNumber.reducer';
import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  tableQuery: {
    page_size: 12,
    page: 1,
  },
  paginationMeta: {
    total: 0,
  },
};

export default createReducer(initialState, {
  [t.INVENTORY_ADJUSTMENTS_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.INVENTORY_ADJUSTMENT_DELETE]: (state, action) => {
    const { id } = action.payload;
    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.INVENTORY_ADJUSTMENTS_PAGE_SET]: (state, action) => {
    const { customViewId, inventory_adjustments, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: inventory_adjustments.map((i) => i.id),
        },
      },
    };
  },

  //useless
  [t.INVENTORY_ADJUSTMENT_ITEMS_SET]: (state, action) => {
    const { inventory_adjustment } = action.payload;
    const _inventory_adjustment = {};

    inventory_adjustment.forEach((_inventory) => {
      _inventory_adjustment[_inventory.id] = {
        ..._inventory,
      };
    });
    state.items = {
      ...state.items,
      ..._inventory_adjustment,
    };
  },
  [t.INVENTORY_ADJUSTMENTS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  ...viewPaginationSetReducer(t.INVENTORY_ADJUSTMENTS_PAGINATION_SET),
  ...createTableQueryReducers('INVENTORY_ADJUSTMENTS'),
});
