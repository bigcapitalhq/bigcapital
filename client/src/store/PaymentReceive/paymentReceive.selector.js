import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const paymentReceivesPageSelector = (state, props, query) => {
  const viewId = state.paymentReceives.currentViewId;
  return state.paymentReceives.views?.[viewId]?.pages?.[query.page];
};

const paymentReceivesItemsSelector = (state) => {
  return state.paymentReceives.items;
};

export const getPaymentReceiveCurrentPageFactory = () =>
  createSelector(
    paymentReceivesPageSelector,
    paymentReceivesItemsSelector,
    (Page, Items) => {
      return typeof Page === 'object'
        ? pickItemsFromIds(Items, Page.ids) || []
        : [];
    },
  );

const paymentReceiveTableQuery = (state) => state.paymentReceives.tableQuery;

export const getPaymentReceiveTableQuery = createSelector(
  paginationLocationQuery,
  paymentReceiveTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

const PaymentReceivePaginationSelector = (state, props) => {
  const viewId = state.paymentReceives.currentViewId;
  return state.paymentReceives.views?.[viewId];
};

export const getPaymentReceivePaginationMetaFactory = () =>
  createSelector(PaymentReceivePaginationSelector, (Page) => {
    return Page?.paginationMeta || {};
  });

const invoicesItems = (state) => {
  return state.salesInvoices.items;
};


const payemntReceiveById = (state, props) => {
  return state.paymentReceives.items[props.paymentReceiveId];
};

export const getPaymentReceiveByIdFactory = () =>
  createSelector(payemntReceiveById, (payment_receive) => {
    return payment_receive;
  });


const paymentReceiveInvoicesIdss = (state, props) => {
  return state.paymentReceives.items[props.paymentReceiveInvoices]
};

// const invoicesItems = (state) => {
//   return state.sales_invoices.items;
// };

// export const  = createSelector(
//   paymentReceiveInvoicesIds,
//   invoicesItems,
//   (ids, items) => {},
// );

export const getPaymentReceiveInvoices = createSelector(
  payemntReceiveById,
  invoicesItems,
  (paymentRecieve, items) => {
    return typeof paymentRecieve === 'object'
      ? pickItemsFromIds(
          items,
          paymentRecieve.entries.map((entry) => entry.invoice_id),
        )
      : [];
  },
);
