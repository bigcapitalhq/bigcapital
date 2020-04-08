import { pickItemsFromIds } from 'store/selectors';

export const getManualJournalsItems = (state, viewId) => {
  const accountsView = state.manualJournals.views[viewId || -1];
  const accountsItems = state.manualJournals.items;

  return typeof accountsView === 'object'
    ? pickItemsFromIds(accountsItems, accountsView.ids) || []
    : [];
};
