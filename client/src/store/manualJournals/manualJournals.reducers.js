import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';
import { omit } from 'lodash';
import {
  journalNumberChangedReducer,
  viewPaginationSetReducer,
  createTableQueryReducers,
} from 'store/journalNumber.reducer';

const initialState = {
  items: {},
  views: {},
  loading: false,
  currentViewId: -1,
  tableQuery: {
    page_size: 12,
    page: 1,
  },
  paginationMeta: {
    total: 0,
  },
  journalNumberChanged: false,
};

const defaultJournal = {
  entries: [],
};

export default createReducer(initialState, {
  [t.MANUAL_JOURNAL_SET]: (state, action) => {
    const { id, manualJournal } = action.payload;
    state.items[id] = { ...defaultJournal, ...manualJournal };
  },

  [t.MANUAL_JOURNAL_PUBLISH]: (state, action) => {
    const { id } = action.payload;
    const item = state.items[id] || {};

    state.items[id] = { ...item, status: 1 };
  },

  [t.MANUAL_JOURNALS_ITEMS_SET]: (state, action) => {
    const _manual_journals = {};

    action.manual_journals.forEach((manual_journal) => {
      _manual_journals[manual_journal.id] = {
        ...defaultJournal,
        ...manual_journal,
      };
    });
    state.items = {
      ...state.items,
      ..._manual_journals,
    };
  },

  [t.MANUAL_JOURNALS_PAGE_SET]: (state, action) => {
    const { customViewId, manualJournals, pagination } = action.payload;

    const viewId = customViewId || -1;
    const view = state.views[viewId] || {};

    state.views[viewId] = {
      ...view,
      pages: {
        ...(state.views?.[viewId]?.pages || {}),
        [pagination.page]: {
          ids: manualJournals.map((i) => i.id),
        },
      },
    };
  },

  [t.MANUAL_JOURNALS_TABLE_LOADING]: (state, action) => {
    state.loading = action.loading;
  },

  [t.MANUAL_JOURNALS_SET_CURRENT_VIEW]: (state, action) => {
    const { currentViewId } = action.payload;
    state.currentViewId = currentViewId;
  },

  [t.MANUAL_JOURNAL_REMOVE]: (state, action) => {
    const { id } = action.payload;
    state.items = omit(state.items, [id]);
  },

  [t.MANUAL_JOURNALS_BULK_DELETE]: (state, action) => {
    const { ids } = action.payload;
    const items = { ...state.items };

    ids.forEach((id) => {
      if (typeof items[id] !== 'undefined') {
        delete items[id];
      }
    });
    state.items = items;
  },

  ...viewPaginationSetReducer(t.MANUAL_JOURNALS_PAGINATION_SET),
  ...journalNumberChangedReducer(t.MANUAL_JOURNAL_NUMBER_CHANGED),
  ...createTableQueryReducers('MANUAL_JOURNALS'),
});

export const getManualJournal = (state, id) => {
  return state.manualJournals.items[id];
};
