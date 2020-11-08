import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';
import t from 'store/types';
import { journalNumberChangedReducer } from 'store/journalNumber.reducer';

const initialState = {
  items: {},
  views: {},
  loading: false,
  tableQuery: {
    page_size: 5,
    page: 1,
  },
  currentViewId: -1,
};

const defaultReceipt = {
  entries: [],
};

const reducer = createReducer(initialState, {
  [t.RECEIPT_SET]: (state, action) => {
    const { id, sale_receipt } = action.payload;
    const _receipt = state.items[id] || {};
    state.items[id] = { ...defaultReceipt, ..._receipt, ...sale_receipt };
  },

  [t.RECEIPTS_ITEMS_SET]: (state, action) => {
    const { sales_receipts } = action.payload;
    const _receipts = {};
    sales_receipts.forEach((receipt) => {
      _receipts[receipt.id] = {
        ...defaultReceipt,
        ...receipt,
      };
    });
    state.items = {
      ...state.items,
      ..._receipts,
    };
  },

  [t.RECEIPTS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.RECEIPT_DELETE]: (state, action) => {
    const { id } = action.payload;
    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.RECEIPTS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.RECEIPTS_PAGE_SET]: (state, action) => {
    const { customViewId, sales_receipts, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};
    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: sales_receipts.map((i) => i.id),
        },
      },
    };
  },

  [t.RECEIPTS_PAGINATION_SET]: (state, action) => {
    const { pagination, customViewId } = action.payload;

    const mapped = {
      pageSize: parseInt(pagination.page_size, 10),
      page: parseInt(pagination.page, 10),
      total: parseInt(pagination.total, 10),
    };
    const paginationMeta = {
      ...mapped,
      pagesCount: Math.ceil(mapped.total / mapped.pageSize),
      pageIndex: Math.max(mapped.page - 1, 0),
    };
    state.views = {
      ...state.views,
      [customViewId]: {
        ...(state.views?.[customViewId] || {}),
        paginationMeta,
      },
    };
  },
  ...journalNumberChangedReducer(t.RECEIPT_NUMBER_CHANGED),
});

export default createTableQueryReducers('sales_receipts', reducer);

export const getReceiptById = (state, id) => {
  return state.receipts.items[id];
};
