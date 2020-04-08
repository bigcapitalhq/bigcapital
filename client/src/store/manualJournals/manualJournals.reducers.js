import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';
import { omit } from 'lodash';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  tableQuery: {},
};

export default createReducer(initialState, {
  
  [t.MANUAL_JOURNAL_SET]: (state, action) => {
    const { id, manualJournal } = action.payload;
    state.items[id] = manualJournal;
  },

  [t.MANUAL_JOURNAL_PUBLISH]: (state, action) => {
    const { id } = action.payload;
    const item = state.items[id] || {};

    state.items[id] = {
      ...item, status: 1,
    };
  },

  [t.MANUAL_JOURNALS_ITEMS_SET]: (state, action) => {
    const _manual_journals = {};

    action.manual_journals.forEach((manual_journal) => {
      _manual_journals[manual_journal.id] = manual_journal;
    });
    state.items = {
      ...state.items,
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
  },

  [t.MANUAL_JOURNALS_TABLE_LOADING]: (state, action) => {
    state.loading = action.loading;
  },

  [t.MANUAL_JOURNALS_SET_CURRENT_VIEW]: (state, action) => {
    state.currentViewId = action.currentViewId;
  },

  [t.MANUAL_JOURNAL_REMOVE]: (state, action) => {
    const { id } = action.payload;
    state.items = omit(state.items, [id]);
  }
});


export const getManualJournal = (state, id) => {
  return state.manualJournals.items[id];
}