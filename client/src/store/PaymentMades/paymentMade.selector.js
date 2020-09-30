import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';



const paymentMadeTableQuery = (state) => state.paymentMades.tableQuery;

const paymentMadesPageSelector = (state, props, query) => {
  const viewId = state.paymentMades.currentViewId;
  return state.paymentMades.views?.[viewId]?.pages?.[query.page];
};

const paymentMadesItemsSelector = (state) => {
  return state.paymentMades.items;
};

const PaymentMadePaginationSelector = (state, props) => {
  const viewId = state.paymentMades.currentViewId;
  return state.paymentMades.views?.[viewId];
};

const paymentMadesIds = (state, props) => {
  return state.paymentMades.items[props.paymentMadeId];
};

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
  createSelector(paymentMadesIds, (payment_Made) => {
    return payment_Made;
  });
