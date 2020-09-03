import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const receiptsPageSelector = (state, props, query) => {
  const viewId = state.salesReceipts.currentViewId;
  return state.salesReceipts.views?.[viewId]?.pages?.[query.page];
};

const receiptsPaginationSelector = (state, props) => {
  const viewId = state.salesReceipts.currentViewId;
  return state.salesReceipts.views?.[viewId];
};

const receiptItemsSelector = (state) => state.salesReceipts.items;

const receiptTableQuery = (state) => state.salesReceipts.tableQuery;

const receiptByIdSelector = (state, props) => state.salesReceipts.items[props.receiptId];


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

export const getReceiptsTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    receiptTableQuery,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

export const getReceiptByIdFactory = () =>
  createSelector(receiptByIdSelector, (receipt) => {
    return receipt;
  });

export const getReceiptsPaginationMetaFactory = () =>
  createSelector(receiptsPaginationSelector, (receiptPage) => {
    return receiptPage?.paginationMeta || {};
  });
