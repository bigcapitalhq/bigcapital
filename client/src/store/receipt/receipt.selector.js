import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const receiptsPageSelector = (state, props, query) => {
  const viewId = state.sales_receipts.currentViewId;
  return state.sales_receipts.views?.[viewId]?.pages?.[query.page];
};

const receiptItemsSelector = (state) => {
  return state.sales_receipts.items;
};

export const getReceiptCurrentPageFactory = () =>
  createSelector(
    receiptsPageSelector,
    receiptItemsSelector,
    (receiptPage, receiptItems) => {
      return typeof receiptPage === 'object'
        ? pickItemsFromIds(receiptItems, receiptPage.ids) || []
        : [];
    },
  );

const receiptTableQuery = (state) => {
  return state.sales_receipts.tableQuery;
};

export const getReceiptsTableQuery = createSelector(
  paginationLocationQuery,
  receiptTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

const receiptByIdSelector = (state, props) => {
  return state.sales_receipts.items[props.receiptId];
};

export const getReceiptByIdFactory = () =>
  createSelector(receiptByIdSelector, (receipt) => {
    return receipt;
  });

const receiptsPaginationSelector = (state, props) => {
  const viewId = state.sales_receipts.currentViewId;
  return state.sales_receipts.views?.[viewId];
};

export const getReceiptsPaginationMetaFactory = () =>
  createSelector(receiptsPaginationSelector, (receiptPage) => {
    return receiptPage?.paginationMeta || {};
  });
