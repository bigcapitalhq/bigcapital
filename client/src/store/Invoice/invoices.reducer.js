import { createReducer } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';
import { journalNumberChangedReducer } from 'store/journalNumber.reducer';

import t from 'store/types';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  tableQuery: {
    page_size: 5,
    page: 1,
  },
  dueInvoices: {},
  receivable: {
    byCustomerId: [],
    byPaymentReceiveId: [],
  },
  byPaymentReceiveId: {},
};

const defaultInvoice = {
  entries: [],
};

const reducer = createReducer(initialState, {
  [t.INVOICE_SET]: (state, action) => {
    const { id, sale_invoice } = action.payload;
    const _invoice = state.items[id] || {};
    state.items[id] = { ...defaultInvoice, ..._invoice, ...sale_invoice };
  },

  [t.INVOICES_ITEMS_SET]: (state, action) => {
    const { sales_invoices } = action.payload;
    const _invoices = {};

    sales_invoices.forEach((invoice) => {
      _invoices[invoice.id] = {
        ...defaultInvoice,
        ...invoice,
      };
    });
    state.items = {
      ...state.items,
      ..._invoices,
    };
  },

  [t.INVOICES_TABLE_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.loading = loading;
  },

  [t.INVOICES_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.INVOICE_DELETE]: (state, action) => {
    const { id } = action.payload;

    if (typeof state.items[id] !== 'undefined') {
      delete state.items[id];
    }
  },

  [t.INVOICES_PAGE_SET]: (state, action) => {
    const { customViewId, sales_invoices, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: sales_invoices.map((i) => i.id),
        },
      },
    };
  },

  [t.INVOICES_PAGINATION_SET]: (state, action) => {
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

  [t.INVOICES_RECEIVABLE_BY_PAYMENT_ID]: (state, action) => {
    const { paymentReceiveId, saleInvoices } = action.payload;
    const saleInvoicesIds = saleInvoices.map((saleInvoice) => saleInvoice.id);

    state.receivable.byPaymentReceiveId[paymentReceiveId] = saleInvoicesIds;
  },

  [t.INVOICES_RECEIVABLE_BY_CUSTOMER_ID]: (state, action) => {
    const { customerId, saleInvoices } = action.payload;
    const saleInvoiceIds = saleInvoices.map((saleInvoice) => saleInvoice.id);

    state.receivable.byCustomerId[customerId] = saleInvoiceIds;
  },

  [t.INVOICES_BY_PAYMENT_ID]: (state, action) => {
    const { paymentReceiveId, saleInvoices } = action.payload;
    const saleInvoiceIds = saleInvoices.map((saleInvoice) => saleInvoice.id);

    state.byPaymentReceiveId[paymentReceiveId] = saleInvoiceIds;
  },

  ...journalNumberChangedReducer(t.INVOICE_NUMBER_CHANGED),
});

export default createTableQueryReducers('sales_invoices', reducer);

export const getInvoiceById = (state, id) => {
  return state.sales_invoices.items[id];
};
