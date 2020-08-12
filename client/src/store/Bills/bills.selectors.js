import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const billTableQuery = (state) => {
  return state.bills.tableQuery;
};

export const getBillTableQuery = createSelector(
  paginationLocationQuery,
  billTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

const billPageSelector = (state, props, query) => {
  const viewId = state.bills.currentViewId;
  return state.bills.views?.[viewId]?.pages?.[query.page];
};

const billItemsSelector = (state) => {
  return state.bills.items;
};

export const getBillCurrentPageFactory = () =>
  createSelector(billPageSelector, billItemsSelector, (billPage, billItems) => {
    return typeof billPage === 'object'
      ? pickItemsFromIds(billItems, billPage.ids) || []
      : [];
  });

const billByIdSelector = (state, props) => {
  return state.bills.items[props.billId];
};

export const getBillByIdFactory = () =>
  createSelector(billByIdSelector, (bill) => {
    return bill;
  });

const billPaginationSelector = (state, props) => {
  const viewId = state.bills.currentViewId;
  return state.bills.views?.[viewId];
};

export const getBillPaginationMetaFactory = () =>
  createSelector(billPaginationSelector, (billPage) => {
    return billPage?.paginationMeta || {};
  });
