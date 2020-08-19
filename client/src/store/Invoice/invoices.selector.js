import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const invoiceTableQuery = (state) => state.sales_invoices.tableQuery;

const invoicesByIdSelector = (state, props) => 
  state.sales_invoices.items[props.invoiceId];

const invoicesPaginationSelector = (state, props) => {
  const viewId = state.sales_invoices.currentViewId;
  return state.sales_invoices.views?.[viewId];
};

const invoicesPageSelector = (state, props, query) => {
  const viewId = state.sales_invoices.currentViewId;
  return state.sales_invoices.views?.[viewId]?.pages?.[query.page];
};

const invoicesItemsSelector = (state) => state.sales_invoices.items;


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
