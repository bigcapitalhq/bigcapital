import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const initialState = {
  pageTitle: '',
  pageSubtitle: '',
  pageHint: '',
  preferencesPageTitle: '',
  sidebarExpended: true,
  previousSidebarExpended: null,
  dialogs: {},
  topbarEditViewId: null,
  requestsLoading: 0,
};

const reducerInstance = createReducer(initialState, {
  [t.CHANGE_DASHBOARD_PAGE_TITLE]: (state, action) => {
    state.pageTitle = action.pageTitle;
  },

  [t.ALTER_DASHBOARD_PAGE_SUBTITLE]: (state, action) => {
    state.pageSubtitle = action.pageSubtitle;
  },

  [t.CHANGE_DASHBOARD_PAGE_HINT]: (state, action) => {
    state.pageHint = action.pageHint;
  },

  [t.CHANGE_PREFERENCES_PAGE_TITLE]: (state, action) => {
    state.preferencesPageTitle = action.pageTitle;
  },

  [t.OPEN_DIALOG]: (state, action) => {
    state.dialogs[action.name] = {
      isOpen: true,
      payload: action.payload || {},
    };
  },

  [t.CLOSE_DIALOG]: (state, action) => {
    state.dialogs[action.name] = {
      ...state.dialogs[action.name],
      isOpen: false,
    };
  },

  [t.CLOSE_ALL_DIALOGS]: (state, action) => {
    
  },

  [t.SET_TOPBAR_EDIT_VIEW]: (state, action) => {
    state.topbarEditViewId = action.id;
  },

  [t.SET_DASHBOARD_REQUEST_LOADING]: (state, action) => {
    state.requestsLoading = state.requestsLoading + 1;
  },

  [t.SET_DASHBOARD_REQUEST_COMPLETED]: (state, action) => {
    const requestsLoading = state.requestsLoading - 1;
    state.requestsLoading = Math.max(requestsLoading, 0);
  },

  [t.RECORD_SIDEBAR_PREVIOUS_EXPAND]: (state) => {
    state.previousSidebarExpended = state.sidebarExpended;
  },

  [t.SIDEBAR_EXPEND_TOGGLE]: (state) => {
    state.sidebarExpended = !state.sidebarExpended;
  },

  [t.SIDEBAR_EXPAND]: (state) => {
    state.sidebarExpended = true;
  },

  [t.SIDEBAR_SHRINK]: (state) => {
    state.sidebarExpended = false;
  },

  [t.RESET_SIDEBAR_PREVIOUS_EXPAND]: (state) => {
    state.sidebarExpended = state.previousSidebarExpended;
  },
});

export default persistReducer({
  key: 'bigcapital:dashboard',
  blacklist: [
    'pageTitle',
    'pageSubtitle',
    'pageHint',
    'preferencesPageTitle',
    'topbarEditViewId'
  ],
  storage,
}, reducerInstance);

export const getDialogPayload = (state, dialogName) => {
  return typeof state.dashboard.dialogs[dialogName] !== 'undefined'
    ? state.dashboard.dialogs[dialogName].payload : {};
};

export const getDialogActiveStatus = (state, dialogName) => {
  return true;
};