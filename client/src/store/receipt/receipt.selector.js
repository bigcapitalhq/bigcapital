import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const receiptsPageSelector = (state) => {
  const viewId = state.salesReceipts.currentViewId;
  const currentView = state.salesReceipts.views?.[viewId];
  const currentPageId = currentView?.paginationMeta?.page;

  return currentView?.pages?.[currentPageId];
};

const receiptsPaginationSelector = (state, props) => {
  const viewId = state.salesReceipts.currentViewId;
  return state.salesReceipts.views?.[viewId];
};

const receiptItemsSelector = (state) => state.salesReceipts.items;

const receiptTableQuery = (state) => state.salesReceipts.tableQuery;

const receiptByIdSelector = (state, props) => state.salesReceipts.items[props.receiptId];

const receiptsCurrentViewIdSelector = (state) => state.salesReceipts.currentViewId;

// Retrieve current page sale receipts results. 
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

// Retrieve receipts table query.
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

// Retrieve specific receipts by the passed receipt id.
export const getReceiptByIdFactory = () =>
  createSelector(receiptByIdSelector, (receipt) => {
    return receipt;
  });

// Retrieve receipts pagination meta.
export const getReceiptsPaginationMetaFactory = () =>
  createSelector(receiptsPaginationSelector, (receiptPage) => {
    return receiptPage?.paginationMeta || {};
  });

// Retrieve receipts current view id.
export const getReceiptsCurrentViewIdFactory = () => 
  createSelector(
    receiptsCurrentViewIdSelector,
    (currentViewId) => currentViewId);