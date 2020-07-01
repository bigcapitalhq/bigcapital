import { createSelector } from 'reselect';
import { pickItemsFromIds, paginationLocationQuery } from 'store/selectors';

const manualJournalsPageSelector = (state, props, query) => {
  const viewId = state.manualJournals.currentViewId;
  return state.manualJournals.views?.[viewId]?.pages?.[query.page];
};

const manualJournalsPaginationSelector = (state, props) => {
  const viewId = state.manualJournals.currentViewId;
  return state.manualJournals.views?.[viewId];
};

const manualJournalsTableQuery = (state) => state.manualJournals.tableQuery;
const manualJournalsDataSelector = (state) => state.manualJournals.items;


export const getManualJournalsItems = createSelector(
  manualJournalsPageSelector,
  manualJournalsDataSelector,
  (manualJournalsPage, manualJournalsItems) => {
    return typeof manualJournalsPage === 'object'
      ? pickItemsFromIds(manualJournalsItems, manualJournalsPage.ids) || []
      : [];
  },
);

export const getManualJournalsPagination = createSelector(
  manualJournalsPaginationSelector,
  (manualJournalsPage) => {
    return manualJournalsPage?.paginationMeta || {};
  },
);

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
