import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const estimateTableQuery = (state) => {
  return state.sales_estimates.tableQuery;
};

export const getEstimatesTableQuery = createSelector(
  paginationLocationQuery,
  estimateTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

const estimatesPageSelector = (state, props, query) => {
  const viewId = state.sales_estimates.currentViewId;
  return state.sales_estimates.views?.[viewId]?.pages?.[query.page];
};

const estimateItemsSelector = (state) => state.sales_estimates.items;

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

const estimateByIdSelector = (state, props) => {
  return state.sales_estimates.items[props.estimateId];
};

export const getEstimateByIdFactory = () =>
  createSelector(estimateByIdSelector, (estimate) => {
    return estimate;
  });

const estimatesPaginationSelector = (state, props) => {
  const viewId = state.sales_estimates.currentViewId;
  return state.sales_estimates.views?.[viewId];
};

export const getEstimatesPaginationMetaFactory = () =>
  createSelector(estimatesPaginationSelector, (estimatePage) => {
    return estimatePage?.paginationMeta || {};
  });
