import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';
import { transformToObject } from 'utils';

const paymentMadeTableQuery = (state) => state.paymentMades.tableQuery;

const paymentMadesPageSelector = (state, props, query) => {
  const viewId = state.paymentMades.currentViewId;
  return state.paymentMades.views?.[viewId]?.pages?.[query.page];
};

const paymentMadesItemsSelector = (state) => state.paymentMades.items;

const PaymentMadePaginationSelector = (state, props) => {
  const viewId = state.paymentMades.currentViewId;
  return state.paymentMades.views?.[viewId];
};

const paymentMadeById = (state, props) => state.paymentMades.items[props.paymentMadeId];

const paymentMadeEntries = (state, props) => props.paymentMadeEntries;
const billsItemsSelector = (state, props) => state.bills.items;
const billsPayableByPaymentMadeSelector = (state, props) => state.bills.payable.byBillPayamentId[props.paymentMadeId];
const paymentMadeBillsSelector = (state, props) => state.bills.byBillPayamentId[props.paymentMadeId];

export const getPaymentMadeCurrentPageFactory = () =>
  createSelector(
    paymentMadesPageSelector,
    paymentMadesItemsSelector,
    (Page, Items) => {
      return typeof Page === 'object'
        ? pickItemsFromIds(Items, Page.ids) || []
        : [];
    },
  );

export const getPaymentMadeTableQuery = createSelector(
  paginationLocationQuery,
  paymentMadeTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

export const getPaymentMadePaginationMetaFactory = () =>
  createSelector(PaymentMadePaginationSelector, (Page) => {
    return Page?.paginationMeta || {};
  });

export const getPaymentMadeByIdFactory = () =>
  createSelector(paymentMadeById, (payment_Made) => {
    return payment_Made;
  });

export const getPaymentMadeEntriesDataFactory = () => 
  createSelector(
    billsItemsSelector,
    paymentMadeEntries,
    (billsItems, paymentEntries) => {
      return Array.isArray(paymentEntries) ? 
        paymentEntries.map((entry) => ({
          ...entry, ...(billsItems[entry.bill_id] || {}),
        })) : [];
    }
  );

export const getPaymentMadeEntriesFactory = () => 
  createSelector(
    billsItemsSelector,
    billsPayableByPaymentMadeSelector,
    paymentMadeBillsSelector,
    paymentMadeById,
    (
      billsItems,
      paymentPayableBillsIds,
      paymentMadeBillsIds,
      paymentMade,
    ) => {
      const billsIds = [
        ...(paymentPayableBillsIds || []),
        ...(paymentMadeBillsIds || []),
      ];
      const bills = pickItemsFromIds(billsItems, billsIds);
      const billEntries = transformToObject((paymentMade?.entries || []), 'bill_id');

      return bills.map((bill) => {
        const paymentMadeEntry = (billEntries?.[bill.id] || {});

        return {
          ...bill,
          bill_id: bill.id,
          total_payment_amount: bill.payment_amount,
          id: paymentMadeEntry?.id,
          payment_amount: paymentMadeEntry?.payment_amount,
        };
      });
    },
  );