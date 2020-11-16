import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, paginationLocationQuery, defaultPaginationMeta } from 'store/selectors';

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
  const currentPageId = state.salesEstimates.views?.[viewId]?.paginationMeta?.page;

  return state.salesEstimates.views?.[viewId]?.pages?.[currentPageId];
};

// Retrieve estimates table query.
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

// Retreive estimate results of the current page.
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

// Retrieve specific estimate by the passed estimate id.
export const getEstimateByIdFactory = () =>
  createSelector(estimateByIdSelector, (estimate) => {
    return estimate;
  });

// Retrieve estimates pagination meta.
export const getEstimatesPaginationMetaFactory = () =>
  createSelector(estimatesCurrentViewSelector, (estimateView) => {
    return {
      ...defaultPaginationMeta(),
      ...(estimateView?.paginationMeta || {}),
    };
  });
