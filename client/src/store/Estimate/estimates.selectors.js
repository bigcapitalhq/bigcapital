import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const estimateTableQuery = (state) => state.salesEstimates.tableQuery;

const estimateByIdSelector = (state, props) => 
  state.salesEstimates.items[props.estimateId];

const estimatesCurrentViewSelector = (state, props) => {
  const viewId = state.salesEstimates.currentViewId;
  return state.salesEstimates.views?.[viewId];
};
const estimateItemsSelector = (state) => state.salesEstimates.items;

const estimatesPageSelector = (state, props, query) => {
  const viewId = state.salesEstimates.currentViewId;
  return state.salesEstimates.views?.[viewId]?.pages?.[query.page];
};

export const getEstimatesTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    estimateTableQuery,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

export const getEstimateCurrentPageFactory = () =>
  createSelector(
    estimatesPageSelector,
    estimateItemsSelector,
    (estimatePage, estimateItems) => {
      return typeof estimatePage === 'object'
        ? pickItemsFromIds(estimateItems, estimatePage.ids) || []
        : [];
    },
  );

export const getEstimateByIdFactory = () =>
  createSelector(estimateByIdSelector, (estimate) => {
    return estimate;
  });

export const getEstimatesPaginationMetaFactory = () =>
  createSelector(estimatesCurrentViewSelector, (estimateView) => {
    return estimateView?.paginationMeta || {};
  });
