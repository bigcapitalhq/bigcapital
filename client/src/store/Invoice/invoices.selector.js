import { createSelector } from '@reduxjs/toolkit';
import {
  pickItemsFromIds,
  paginationLocationQuery,
  getItemById,
} from 'store/selectors';

const invoiceTableQuery = (state) => state.salesInvoices.tableQuery;

const invoicesByIdSelector = (state, props) =>
  state.salesInvoices.items[props.invoiceId];

const invoicesPaginationSelector = (state, props) => {
  const viewId = state.salesInvoices.currentViewId;
  return state.salesInvoices.views?.[viewId];
};

const invoicesPageSelector = (state, props, query) => {
  const viewId = state.salesInvoices.currentViewId;
  return state.salesInvoices.views?.[viewId]?.pages?.[query.page];
};

const invoicesItemsSelector = (state) => state.salesInvoices.items;

export const getInvoiceTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    invoiceTableQuery,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

export const getInvoiceCurrentPageFactory = () =>
  createSelector(
    invoicesPageSelector,
    invoicesItemsSelector,
    (invoicePage, invoicesItems) => {
      return typeof invoicePage === 'object'
        ? pickItemsFromIds(invoicesItems, invoicePage.ids) || []
        : [];
    },
  );

export const getInvoiecsByIdFactory = () =>
  createSelector(invoicesByIdSelector, (invoice) => {
    return invoice;
  });

export const getInvoicePaginationMetaFactory = () =>
  createSelector(invoicesPaginationSelector, (invoicePage) => {
    return invoicePage?.paginationMeta || {};
  });

const dueInvoicesSelector = (state, props) => {
  return state.salesInvoices.dueInvoices[props.customer_id] || [];
};

export const getdueInvoices = createSelector(
  dueInvoicesSelector,
  invoicesItemsSelector,
  (customerIds, items) => {
    
    return typeof customerIds === 'object'
      ? pickItemsFromIds(items, customerIds) || []
      : [];
  },
);
