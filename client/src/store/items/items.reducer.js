import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';
import { getItemsViewPages } from 'store/items/items.selectors';
import {
  viewPaginationSetReducer,
  createTableQueryReducers,
} from 'store/journalNumber.reducer';

const initialState = {
  items: {},
  views: {},
  itemsRelation: {},
  currentPage: 1,
  currentViewId: -1,
  bulkActions: {},
  loading: false,
  tableQuery: {
    page_size: 12,
    page: 1,
  },
};

export default createReducer(initialState, {
  [t.ITEMS_SET]: (state, action) => {
    const _items = {};

    action.items.forEach((item) => {
      _items[item.id] = item;
    });
    state.items = {
      ...state.items,
      ..._items,
    };
  },

  [t.ITEM_SET]: (state, action) => {
    const { id, item } = action.payload;
    state.items[id] = { ...item };
  },

  [t.ITEMS_PAGE_SET]: (state, action) => {
    const { items, customViewId, paginationMeta } = action;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [paginationMeta.page]: {
          ids: items.map((item) => item.id),
        },
      },
    };
  },

  [t.ITEM_BULK_ACTION_ADD]: (state, action) => {
    state.bulkActions[action.itemId] = true;
  },

  [t.ITEM_BULK_ACTION_REMOVE]: (state, action) => {
    delete state.bulkActions[action.itemId];
  },

  [t.ITEM_DELETE]: (state, action) => {
    const { id } = action.payload;
    const items = { ...state.items };

    if (items[id]) {
      const item = items[id];

      delete items[id];
      state.items = items;
    }
  },

  [t.ITEMS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = !!loading;
  },

  [t.ITEMS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.ITEMS_BULK_DELETE]: (state, action) => {
    const { ids } = action.payload;
    const items = { ...state.items };

    ids.forEach((id) => {
      if (typeof items[id] !== 'undefined') {
        delete items[id];
      }
    });
    state.items = items;
  },

  ...viewPaginationSetReducer(t.ITEMS_PAGINATION_SET),
  ...createTableQueryReducers('ITEMS'),
});

export const getItemById = (state, id) => {
  return state.items.items[id];
};
