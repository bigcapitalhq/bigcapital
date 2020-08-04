import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const estimateTableQuery = (state) => state.estimates.tableQuery;

export const getEstimatesTableQuery = createSelector(
  paginationLocationQuery,
  estimateTableQuery,
  (location, query) => ({
    ...location,
    ...query,
  }),
);

const estimatesSelector = (state, props, query) => {
  const viewId = state.estimates.currentViewId;
  return state.estimates.views?.[viewId]?.pages?.[query.page];
};

const EstimateItemsSelector = (state) => state.estimates.items;

export const getEstimateCurrentPage = () =>
  createSelector(estimatesSelector, EstimateItemsSelector, (page, items) => {
    return typeof page === 'object'
      ? pickItemsFromIds(items, page.ids) || []
      : [];
  });

const estimateByIdSelector = (state, props) => state.estimates.items;

export const getEstimateByIdFactory = () =>
  createSelector(estimateByIdSelector, (estimate) => {
    return estimate;
  });

const paginationSelector = (state, props) => {
  const viewId = state.estimates.currentViewId;
  return state.estimates.views?.[viewId];
};

export const getEstimatesPaginationMetaFactory = () =>
  createSelector(paginationSelector, (estimatePage) => {
    return estimatePage?.paginationMeta || {};
  });
