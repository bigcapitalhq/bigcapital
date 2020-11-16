import { createSelector } from '@reduxjs/toolkit';
import {
  pickItemsFromIds,
  paginationLocationQuery,
  defaultPaginationMeta,
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
  const currentView = state.salesInvoices.views?.[viewId];
  const currentPageId = currentView?.paginationMeta?.page;

  return currentView?.pages?.[currentPageId];
};

const invoicesItemsSelector = (state) => state.salesInvoices.items;
const invoicesReceiableCustomerSelector = (state, props) =>
  state.salesInvoices.receivable.byCustomerId[props.customerId];

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

// Retrieve invoices of the current view and view.
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

// Retrieve specific invoice by the passed invoice id.
export const getInvoiecsByIdFactory = () =>
  createSelector(invoicesByIdSelector, (invoice) => {
    return invoice;
  });

// Retrieve invoices pagination meta.
export const getInvoicePaginationMetaFactory = () =>
  createSelector(invoicesPaginationSelector, (invoicePage) => {
    return {
      ...defaultPaginationMeta(),
      ...(invoicePage?.paginationMeta || {}),
    };
  });

export const getCustomerReceivableInvoicesEntriesFactory = () =>
  createSelector(
    invoicesItemsSelector,
    invoicesReceiableCustomerSelector,
    (invoicesItems, customerInvoicesIds) => {
      const invoicesIds = [...(customerInvoicesIds || [])];
      const invoices = pickItemsFromIds(invoicesItems, invoicesIds);

      return invoices.map((invoice) => ({
        ...invoice,
        invoice_id: invoice.id,
        total_payment_amount: invoice.payment_amount,
        id: null,
        payment_amount: 0,
      }));
    },
  );
