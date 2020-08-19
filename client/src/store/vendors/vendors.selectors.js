import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const vendorsTableQuery = (state) => {
  return state.vendors.tableQuery;
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
  return state.vendors.views?.[viewId]?.pages?.[query.page];
};

const vendorsItemsSelector = (state) => state.vendors.items;

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

const vendorsPaginationSelector = (state, props) => {
  const viewId = state.vendors.currentViewId;
  return state.vendors.views?.[viewId];
};

export const getVendorsPaginationMetaFactory = () =>
  createSelector(vendorsPaginationSelector, (vendorPage) => {
    return vendorPage?.paginationMeta || {};
  });

const vendorByIdSelector = (state, props) => {
  return state.vendors.items[props.vendorId];
};

export const getEstimateByIdFactory = () =>
  createSelector(vendorByIdSelector, (vendor) => {
    return vendor;
  });
