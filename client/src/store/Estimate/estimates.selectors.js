import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const estimateTableQuery = (state) => state.sales_estimates.tableQuery;

const estimateByIdSelector = (state, props) => 
  state.sales_estimates.items[props.estimateId];

const estimatesCurrentViewSelector = (state, props) => {
  const viewId = state.sales_estimates.currentViewId;
  return state.sales_estimates.views?.[viewId];
};
const estimateItemsSelector = (state) => state.sales_estimates.items;

const estimatesPageSelector = (state, props, query) => {
  const viewId = state.sales_estimates.currentViewId;
  return state.sales_estimates.views?.[viewId]?.pages?.[query.page];
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
