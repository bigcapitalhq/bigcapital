import { createSelector } from '@reduxjs/toolkit';
import {
  pickItemsFromIds,
  paginationLocationQuery,
  defaultPaginationMeta,
} from 'store/selectors';

const vendorsTableQuery = (state) => state.vendors.tableQuery;
const vendorByIdSelector = (state, props) =>
  state.vendors.items[props.vendorId];
const vendorsItemsSelector = (state) => state.vendors.items;

const vendorsPaginationSelector = (state, props) => {
  const viewId = state.vendors.currentViewId;
  return state.vendors.views?.[viewId];
};

export const getVendorsTableQuery = createSelector(
  paginationLocationQuery,
  vendorsTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

const vendorsPageSelector = (state, props, query) => {
  const viewId = state.vendors.currentViewId;
  const currentView = state.vendors.views?.[viewId];
  const currentPageId = currentView?.pages;

  return currentView?.pages?.[currentPageId];
};

export const getVendorCurrentPageFactory = () =>
  createSelector(
    vendorsPageSelector,
    vendorsItemsSelector,
    (vendorPage, vendorItems) => {
      return typeof vendorPage === 'object'
        ? pickItemsFromIds(vendorItems, vendorPage.ids) || []
        : [];
    },
  );

export const getVendorsPaginationMetaFactory = () =>
  createSelector(vendorsPaginationSelector, (vendorPage) => {
    return {
      ...defaultPaginationMeta(),
      ...(vendorPage?.paginationMeta || {}),
    };
  });

export const getVendorByIdFactory = () =>
  createSelector(vendorByIdSelector, (vendor) => {
    return vendor;
  });
