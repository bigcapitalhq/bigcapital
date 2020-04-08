import t from 'store/types';
import { createReducer, combineReducers } from '@reduxjs/toolkit';
import { createTableQueryReducers } from 'store/queryReducers';

const initialState = {
  manual_journals: {},
  views: {},
  manualJournalById: {},
  dataTableQuery: {},
  currentViewId: -1,
  selectedRows: [],
  loading: false,
};

// MANUAL_JOURNALS
const manualJournalsReducer = createReducer(initialState, {
  [t.MANUAL_JOURNALS_ITEMS_SET]: (state, action) => {
    const _manual_journals = {};

    action.manual_journals.forEach((manual_journal) => {
      _manual_journals[manual_journal.id] = manual_journal;
    });

    state.manual_journals = {
      ...state.manual_journals,
      ..._manual_journals,
    };
  },
  [t.MANUAL_JOURNALS_PAGE_SET]: (state, action) => {
    const viewId = action.customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      ids: action.manual_journals.map((i) => i.id),
    };
    // state.manual_journals = action.manual_journals;
  },
  [t.MANUAL_JOURNALS_TABLE_LOADING]: (state, action) => {
    state.loading = action.loading;
  },
  [t.MANUAL_JOURNALS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },
});

export default createTableQueryReducers(
  'manual_journals',
  manualJournalsReducer
);

export const getManualJournalById = (state, id) => {
  return state.manual_journals.manualJournalById[id];
};
