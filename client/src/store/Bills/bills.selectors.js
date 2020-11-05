import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

// Retreive bills table query.
const billTableQuery = (state) => state.bills.tableQuery;

const billPageSelector = (state, props, query) => {
  const viewId = state.bills.currentViewId;
  return state.bills.views?.[viewId]?.pages?.[query.page];
};
// Retreive bills items.
const billItemsSelector = (state) => state.bills.items;

// Retrieve bill details.
const billByIdSelector = (state, props) => state.bills.items[props.billId];

// Retrieve vendor due bills ids.
const billsPayableVendorSelector = (state, props) => state.bills.payable.byVendorId[props.vendorId];

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

/**
 * Retrieve bills datatable pagination meta.
 */
export const getBillPaginationMetaFactory = () =>
  createSelector(billPaginationSelector, (billPage) => {
    return billPage?.paginationMeta || {};
  });

/**
 * Retrieve vendor payable bills.
 */
export const getVendorPayableBillsFactory = () => 
  createSelector(
    billItemsSelector,
    billsPayableVendorSelector,
    (billsItems, payableBillsIds) => {
      return Array.isArray(payableBillsIds)
        ? pickItemsFromIds(billsItems, payableBillsIds) || []
        : [];
    },
  );

/**
 * Retrieve vendor payable bills entries.
 */
export const getVendorPayableBillsEntriesFactory = () => 
  createSelector(
    billItemsSelector,
    billsPayableVendorSelector,
    (billsItems, payableBillsIds) => {
      const bills = Array.isArray(payableBillsIds)
        ? pickItemsFromIds(billsItems, payableBillsIds) || []
        : [];

      return bills.map((bill) => ({
        ...bill,
        bill_id: bill.id,
        total_payment_amount: bill.payment_amount,
        id: null,
        payment_amount: null,
      }));
    }
  );