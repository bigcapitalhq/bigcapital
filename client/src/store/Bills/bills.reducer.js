import { createReducer } from '@reduxjs/toolkit';
import {
  createTableQueryReducers,
  viewPaginationSetReducer,
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
  nextBillNumberChanged: false,
  payable: {
    byVendorId: [],
    byBillPayamentId: [],
  },
  byBillPayamentId: {},
};

const defaultBill = {
  entries: [],
};


export default createReducer(initialState, {
  [t.BILL_SET]: (state, action) => {
    const { id, bill } = action.payload;
    const _bill = state.items[id] || {};

    state.items[id] = { ...defaultBill, ..._bill, ...bill };
  },
  [t.BILLS_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.BILLS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.BILLS_ITEMS_SET]: (state, action) => {
    const { bills } = action.payload;
    const _bills = {};

    bills.forEach((bill) => {
      const oldBill = state.items[bill.id] || {};

      _bills[bill.id] = {
        ...defaultBill,
        ...oldBill,
        ...bill,
      };
    });
    state.items = {
      ...state.items,
      ..._bills,
    };
  },

  [t.BILL_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.BILLS_PAGE_SET]: (state, action) => {
    const { customViewId, bills, pagination } = action.payload;
    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: bills.map((i) => i.id),
        },
      },
    };
  },

  [t.BILL_NUMBER_CHANGED]: (state, action) => {
    const { isChanged } = action.payload;
    state.nextBillNumberChanged = isChanged;
  },

  [t.BILLS_PAYABLE_BY_VENDOR_ID]: (state, action) => {
    const { bills } = action.payload;
    const _data = {};

    bills.forEach((bill) => {
      if (!_data[bill.vendor_id]) {
        _data[bill.vendor_id] = [];
      }
      _data[bill.vendor_id].push(bill.id);
    });

    state.payable.byVendorId = {
      ...state.payable.byVendorId,
      ..._data,
    };
  },

  [t.BILLS_PAYABLE_BY_PAYMENT_ID]: (state, action) => {
    const { bills, billPaymentId } = action.payload;
    const _data = [];

    bills.forEach((bill) => {
      _data.push(bill.id);
    });
    state.payable.byBillPayamentId[billPaymentId] = _data;
  },

  [t.BILLS_BY_PAYMENT_ID]: (state, action) => {
    const { bills, billPaymentId } = action.payload;
    const billsIds = bills.map((bill) => bill.id);

    state.byBillPayamentId[billPaymentId] = billsIds;
  },

  ...viewPaginationSetReducer(t.BILLS_PAGINATION_SET),
  ...createTableQueryReducers('BILLS'),
});