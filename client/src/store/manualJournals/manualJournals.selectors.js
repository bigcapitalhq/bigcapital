import { createSelector } from 'reselect';
import { pickItemsFromIds, paginationLocationQuery, defaultPaginationMeta } from 'store/selectors';

const manualJournalsCurrentViewIdSelector = (state) => state.manualJournals.currentViewId;

const manualJournalsPageSelector = (state) => {
  const viewId = state.manualJournals.currentViewId;
  const currentView = state.manualJournals.views?.[viewId];
  const currentPageId = currentView?.paginationMeta?.page;

  return currentView?.pages?.[currentPageId];
};

const manualJournalsPaginationSelector = (state, props) => {
  const viewId = state.manualJournals.currentViewId;
  return state.manualJournals.views?.[viewId];
};

const manualJournalsTableQuery = (state) => state.manualJournals.tableQuery;
const manualJournalsDataSelector = (state) => state.manualJournals.items;


// Retrieve manual jounral current page results.
export const getManualJournalsItems = createSelector(
  manualJournalsPageSelector,
  manualJournalsDataSelector,
  (manualJournalsPage, manualJournalsItems) => {
    return typeof manualJournalsPage === 'object'
      ? pickItemsFromIds(manualJournalsItems, manualJournalsPage.ids) || []
      : [];
  },
);

// Retrieve manual journals pagination meta.
export const getManualJournalsPagination = createSelector(
  manualJournalsPaginationSelector,
  (manualJournalsPage) => {
    return {
      ...defaultPaginationMeta(),
      ...(manualJournalsPage?.paginationMeta || {}),
    };
  },
);

// Retrieve manual jouranls table query.
export const getManualJournalsTableQuery = createSelector(
  paginationLocationQuery,
  manualJournalsTableQuery,
  (locationQuery, tableQuery) => {
    return {
      ...locationQuery,
      ...tableQuery,
    };
  },
);

// Retrieve manual journals current view id.
export const getManualJournalsCurrentViewIdFactory = () => 
  createSelector(
    manualJournalsCurrentViewIdSelector,
    (currentViewId) => {
      return currentViewId;
    },
  );