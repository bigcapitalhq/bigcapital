import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const billTableQuery = (state) => state.bills.tableQuery;

const billPageSelector = (state, props, query) => {
  const viewId = state.bills.currentViewId;
  return state.bills.views?.[viewId]?.pages?.[query.page];
};
const billItemsSelector = (state) => state.bills.items;

/**
 * Retrieve bill details.
 * @return {IBill}
 */
const billByIdSelector = (state, props) => state.bills.items[props.billId];

/**
 * Retrieve vendor due bills ids.
 * @return {number[]}
 */
const billsDueVendorSelector = (state, props) => state.bills.dueBills[props.vendorId];

const billPaginationSelector = (state, props) => {
  const viewId = state.bills.currentViewId;
  return state.bills.views?.[viewId];
};

export const getBillTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    billTableQuery,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

/**
 * Get current page bills items.
 * @return {Array}
 */
export const getBillCurrentPageFactory = () =>
  createSelector(billPageSelector, billItemsSelector, (billPage, billItems) => {
    return typeof billPage === 'object'
      ? pickItemsFromIds(billItems, billPage.ids) || []
      : [];
  });

/**
 * Retrieve bill details of the given bill id.
 */
export const getBillByIdFactory = () =>
  createSelector(billByIdSelector, (bill) => {
    return bill;
  });

export const getBillPaginationMetaFactory = () =>
  createSelector(billPaginationSelector, (billPage) => {
    return billPage?.paginationMeta || {};
  });

/**
 * Retrieve due bills of specific vendor.
 */
export const getVendorDueBillsFactory = () => 
  createSelector(
    billItemsSelector,
    billsDueVendorSelector,
    (billsItems, dueBillsIds) => {
      return Array.isArray(dueBillsIds)
        ? pickItemsFromIds(billsItems, dueBillsIds) || []
        : [];
    },
  );