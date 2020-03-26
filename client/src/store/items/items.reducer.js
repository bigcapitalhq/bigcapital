import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';
import {
  getItemsViewPages,
} from 'store/items/items.selectors';

const initialState = {
  items: {},
  views: {},
  itemsRelation: {},
  currentPage: 1,
  currentViewId: -1,
  bulkActions: {},
};

export default createReducer(initialState, {
  [t.ITEMS_SET]: (state, action) => {
    const _items = {};

    action.items.forEach(item => {
      _items[item.id] = item;
    });
    state.items = {
      ...state.items,
      ..._items,
    };
  },

  [t.ITEMS_PAGE_SET]: (state, action) => {
    const { items, customViewId, paginationMeta } = action;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};
    const viewPages = getItemsViewPages(state.views, viewId);

    items.forEach((item) => {
      const stateItem = state.items[item.id];
      const itemRelation = state.itemsRelation[stateItem.id];

      if (typeof itemRelation === 'undefined') {
        state.itemsRelation[item.id] = [];
      }
      const filteredRelation = state.itemsRelation[item.id]
        .filter((relation) => (
          relation.viewId === viewId &&
          relation.pageNumber === paginationMeta.page
        ));

      filteredRelation.push({
        viewId,
        pageNumber: paginationMeta.page,
      });
      state.itemsRelation[item.id] = filteredRelation;
    });

    state.views[viewId] = {
      ...view,
      pages: {
        ...viewPages,
        [paginationMeta.page]: {
          ids: items.map(i => i.id),
          meta: paginationMeta,
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
    const { itemId } = action;

    if (state.items[itemId]) {
      const item = state.items[itemId];
      const itemPageNumber = item._page_number;

      delete state.items[itemId];

    }

  },
});

export const getItemById = (state, id) => {
  return state.items.items[id];
};
