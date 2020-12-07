import { paginationLocationQuery } from 'store/selectors';
import { createSelector } from 'reselect';
import { pickItemsFromIds, defaultPaginationMeta } from 'store/selectors';

const itemsTableQuerySelector = (state) => state.items.tableQuery;

const itemsCurrentPageSelector = (state, props) => {
  const currentViewId = state.items.currentViewId;
  const currentView = state.items.views?.[currentViewId];
  const currentPageId = currentView?.paginationMeta?.page;

  return currentView?.pages?.[currentPageId];
};
const itemsDataSelector = (state) => state.items.items;

const itemsPaginationSelector = (state, props) => {
  const viewId = state.items.currentViewId;
  return state.items.views?.[viewId]?.paginationMeta;
};
const itemsCurrentViewIdSelector = (state) => {
  return state.items.currentViewId;
};
// Get items table query marged with location query.
export const getItemsTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    itemsTableQuerySelector,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

// Retrieve items current page and view.
export const getItemsCurrentPageFactory = () =>
  createSelector(
    itemsDataSelector,
    itemsCurrentPageSelector,
    (items, itemsIdsCurrentPage) => {
      return typeof itemsIdsCurrentPage === 'object'
        ? pickItemsFromIds(items, itemsIdsCurrentPage.ids) || []
        : [];
    },
  );

// Retrieve items pagination meta.
export const getItemsPaginationMetaFactory = () =>
  createSelector(itemsPaginationSelector, (itemsPagination) => {
    return {
      ...defaultPaginationMeta(),
      ...itemsPagination,
    };
  });

// Retrieve items current view id.
export const getItemsCurrentViewIdFactory = () =>
  createSelector(itemsCurrentViewIdSelector, (currentViewId) => {
    return currentViewId;
  });
