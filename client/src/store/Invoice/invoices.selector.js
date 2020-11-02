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

const invoicesReceiableCustomerSelector = (state, props) => state.salesInvoices.receivable.byCustomerId[props.customerId];
const paymentReceivableInvoicesSelector = (state, props) => state.salesInvoices.receivable.byPaymentReceiveId[props.paymentReceiveId];


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

// export const getCustomerReceivableInvoicesFactory = () => 
//   createSelector(
//     invoicesItemsSelector,
//     invoicesReceiableCustomerSelector,
//     (invoicesItems, invoicesIds) => {
//       return Array.isArray(invoicesIds)
//         ? (pickItemsFromIds(invoicesItems, invoicesIds) || [])
//         : [];
//     },
//   );

// export const getPaymentReceivableInvoicesFactory = () => 
//     createSelector(
//       invoicesItemsSelector,
//       paymentReceivableInvoicesSelector,
//       (invoicesItems, invoicesIds) => {
//         return Array.isArray(invoicesIds)
//           ? (pickItemsFromIds(invoicesItems, invoicesIds) || [])
//           : [];
//       },
//     );


export const getPaymentReceiveReceivableInvoicesFactory = () => 
  createSelector(
    invoicesItemsSelector,
    invoicesReceiableCustomerSelector,
    paymentReceivableInvoicesSelector,
    (invoicesItems, customerInvoicesIds, paymentInvoicesIds) => {
      const invoicesIds = [
        ...(customerInvoicesIds || []),
        ...(paymentInvoicesIds || []),
      ];
      return pickItemsFromIds(invoicesItems, invoicesIds);
    },
  );