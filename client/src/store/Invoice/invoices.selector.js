import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const invoiceTableQuery = (state) => state.sales_invoices.tableQuery;

export const getInvoiceTableQuery = createSelector(
  paginationLocationQuery,
  invoiceTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

const invoicesPageSelector = (state, props, query) => {
  const viewId = state.sales_invoices.currentViewId;
  return state.sales_invoices.views?.[viewId]?.pages?.[query.page];
};

const invoicesItemsSelector = (state) => {
  return state.sales_invoices.items;
};

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

const invoicesByIdSelector = (state, props) => {
  return state.sales_invoices.items[props.invoiceId];
};

export const getInvoiecsByIdFactory = () =>
  createSelector(invoicesByIdSelector, (invoice) => {
    return invoice;
  });

const invoicesPaginationSelector = (state, props) => {
  const viewId = state.sales_invoices.currentViewId;
  return state.sales_invoices.views?.[viewId];
};

export const getInvoicePaginationMetaFactory = () =>
  createSelector(invoicesPaginationSelector, (invoicePage) => {
    return invoicePage?.paginationMeta || {};
  });
