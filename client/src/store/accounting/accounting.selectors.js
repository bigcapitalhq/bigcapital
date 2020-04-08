import { pickItemsFromIds } from 'store/selectors';

export const getManualJournals = (state, viewId) => {
  const manualJournalView = state.manual_journals.views[-1];
  const manualJournalsItems = state.manual_journals.manual_journals;

  console.log(manualJournalView, 'Message');

  return typeof manualJournalView === 'object' &&
    manualJournalView.ids &&
    manualJournalsItems
    ? pickItemsFromIds(manualJournalsItems, manualJournalView.ids) || []
    : [];
};
