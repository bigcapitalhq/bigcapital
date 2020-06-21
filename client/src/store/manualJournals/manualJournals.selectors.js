import { pickItemsFromIds } from 'store/selectors';

export const getManualJournalsItems = (state, viewId, pageNumber) => {
  const accountsViewPages = state.manualJournals.views[viewId || -1];
  const accountsView = accountsViewPages?.pages?.[pageNumber]?.ids || {};
  const accountsItems = state.manualJournals.items;

  return typeof accountsView === 'object'
    ? pickItemsFromIds(accountsItems, accountsView) || []
    : [];
};
