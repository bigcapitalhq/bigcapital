import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';
import { transformToObject } from 'utils';

const paymentReceivesPageSelector = (state, props, query) => {
  const viewId = state.paymentReceives.currentViewId;
  return state.paymentReceives.views?.[viewId]?.pages?.[query.page];
};

const paymentReceivesItemsSelector = (state) => state.paymentReceives.items;
const paymentReceiveTableQuery = (state) => state.paymentReceives.tableQuery;

const PaymentReceivePaginationSelector = (state, props) => {
  const viewId = state.paymentReceives.currentViewId;
  return state.paymentReceives.views?.[viewId];
};
const invoicesItemsSelector = (state) => state.salesInvoices.items;

const payemntReceiveById = (state, props) =>
  state.paymentReceives.items[props.paymentReceiveId];

const invoicesReceivableByPaymentReceiveSelector = (state, props) =>
  state.salesInvoices.receivable.byPaymentReceiveId[props.paymentReceiveId];

const paymentReceiveInvoicesSelector = (state, props) =>
  state.salesInvoices.byPaymentReceiveId[props.paymentReceiveId];

const paymentReceiveByIdSelector = (state, props) =>
  state.paymentReceives.items[props.paymentReceiveId];

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

export const getPaymentReceivePaginationMetaFactory = () =>
  createSelector(PaymentReceivePaginationSelector, (Page) => {
    return Page?.paginationMeta || {};
  });

export const getPaymentReceiveByIdFactory = () =>
  createSelector(payemntReceiveById, (payment_receive) => {
    return payment_receive;
  });

export const getPaymentReceiveInvoices = createSelector(
  payemntReceiveById,
  invoicesItemsSelector,
  (paymentRecieve, items) => {
    return typeof paymentRecieve === 'object'
      ? pickItemsFromIds(
          items,
          paymentRecieve.entries.map((entry) => entry.invoice_id),
        )
      : [];
  },
);

/**
 * Retrieve payment receive invoices entries.
 */
export const getPaymentReceiveEntriesFactory = () =>
  createSelector(
    invoicesItemsSelector,
    invoicesReceivableByPaymentReceiveSelector,
    paymentReceiveInvoicesSelector,
    paymentReceiveByIdSelector,
    (
      invoicesItems,
      paymentReceivableInvoicesIds,
      paymentReceiveInvoicesIds,
      paymentReceive,
    ) => {
      const invoicesIds = [
        ...(paymentReceivableInvoicesIds || []),
        ...(paymentReceiveInvoicesIds || []),
      ];
      const invoices = pickItemsFromIds(invoicesItems, invoicesIds);
      const invoicesEntries = transformToObject(
        paymentReceive?.entries || [],
        'invoice_id',
      );

      return invoices.map((invoice) => {
        const paymentReceiveEntry = invoicesEntries?.[invoice.id] || {};

        return {
          ...invoice,
          invoice_id: invoice.id,
          total_payment_amount: invoice.payment_amount,
          id: paymentReceiveEntry?.id,
          payment_amount: paymentReceiveEntry?.payment_amount,
        };
      });
    },
  );
