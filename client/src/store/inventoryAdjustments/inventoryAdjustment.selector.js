import { createSelector } from '@reduxjs/toolkit';
import {
  pickItemsFromIds,
  paginationLocationQuery,
  defaultPaginationMeta,
} from 'store/selectors';

const inventoryAdjustmentTableQuery = (state) =>
  state.inventoryAdjustments.tableQuery;

const inventoryAdjustmentsPaginationSelector = (state, props) => {
  const viewId = state.inventoryAdjustments.currentViewId;
  return state.inventoryAdjustments.views?.[viewId];
};

const inventoryAdjustmentItemsSelector = (state) =>
  state.inventoryAdjustments.items;

const inventoryAdjustmentCurrentPageSelector = (state, props) => {
  const currentViewId = state.inventoryAdjustments.currentViewId;
  const currentView = state.inventoryAdjustments.views?.[currentViewId];
  const currentPageId = currentView?.paginationMeta?.page;

  return currentView?.pages?.[currentPageId];
};

const getinventoryAdjustmentCurrentViewIdSelector = (state) =>
  state.inventoryAdjustments.currentViewId;

export const getInvoiceTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    inventoryAdjustmentTableQuery,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

export const getInventoryAdjustmentCurrentPageFactory = () =>
  createSelector(
    inventoryAdjustmentCurrentPageSelector,
    inventoryAdjustmentItemsSelector,
    (currentPage, items) => {
      return typeof currentPage === 'object'
        ? pickItemsFromIds(items, currentPage.ids) || []
        : [];
    },
  );

export const getInventoryAdjustmentPaginationMetaFactory = () =>
  createSelector(inventoryAdjustmentsPaginationSelector, (Page) => {
    return {
      ...defaultPaginationMeta(),
      ...(Page?.paginationMeta || {}),
    };
  });
