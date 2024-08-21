// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { isUndefined, isNumber, omit } from 'lodash';
import t from '@/store/types';
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  pageTitle: '',
  pageSubtitle: '',
  pageHint: '',
  preferencesPageTitle: '',
  sidebarExpended: true,
  dialogs: {},
  alerts: {},
  drawers: {},
  topbarEditViewId: null,
  requestsLoading: 0,
  backLink: false,
  splashScreenLoading: null,
  appIsLoading: true,
  appIntlIsLoading: true,
  sidebarSubmenu: { isOpen: false, submenuId: null },
  features: {},
  autofill: {},
};

const STORAGE_KEY = 'bigcapital:dashboard';

const CONFIG = {
  key: STORAGE_KEY,
  whitelist: [],
  storage,
};

const reducerInstance = createReducer(initialState, {
  [t.CHANGE_DASHBOARD_PAGE_TITLE]: (state, action) => {
    state.pageTitle = action.pageTitle;
  },

  [t.ALTER_DASHBOARD_PAGE_SUBTITLE]: (state, action) => {
    state.pageSubtitle = action.pageSubtitle;
  },

  [t.CHANGE_DASHBOARD_PAGE_HINT]: (state, action) => {
    state.pageHint = action.payload.pageHint;
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

  [t.OPEN_ALERT]: (state, action) => {
    state.alerts[action.name] = {
      isOpen: true,
      payload: action.payload || {},
    };
  },

  [t.CLOSE_ALERT]: (state, action) => {
    state.alerts[action.name] = {
      ...state.alerts[action.name],
      isOpen: false,
    };
  },
  [t.OPEN_DRAWER]: (state, action) => {
    state.drawers[action.name] = {
      isOpen: true,
      payload: action.payload || {},
    };
  },
  [t.CLOSE_DRAWER]: (state, action) => {
    state.drawers[action.name] = {
      ...state.drawers[action.name],
      isOpen: false,
    };
  },
  [t.CLOSE_ALL_DIALOGS]: (state, action) => {},

  [t.SET_TOPBAR_EDIT_VIEW]: (state, action) => {
    state.topbarEditViewId = action.id;
  },

  [t.SIDEBAR_EXPEND_TOGGLE]: (state, action) => {
    const { toggle } = action.payload;
    state.sidebarExpended = isUndefined(toggle)
      ? !state.sidebarExpended
      : !!toggle;
  },

  [t.SET_DASHBOARD_BACK_LINK]: (state, action) => {
    const { backLink } = action.payload;
    state.backLink = backLink;
  },

  [t.SPLASH_START_LOADING]: (state) => {
    if (isNumber(state.splashScreenLoading)) {
      state.splashScreenLoading += 1;
    } else {
      state.splashScreenLoading = 1;
    }
  },

  [t.SET_FEATURE_DASHBOARD_META]: (state, action) => {
    const { features } = action.payload;
    const _data = {};

    features.forEach((feature) => {
      _data[feature.name] = feature.is_accessible;
    });
    state.features = _data;
  },

  [t.SPLASH_STOP_LOADING]: (state) => {
    state.splashScreenLoading -= 1;
    state.splashScreenLoading = Math.max(state.splashScreenLoading, 0);
  },

  [t.SIDEBAR_SUBMENU_OPEN]: (state, action) => {
    state.sidebarSubmenu.isOpen = true;
    state.sidebarSubmenu.submenuId = action.payload.submenuId;
  },

  [t.SIDEBAR_SUBMENU_CLOSE]: (state, action) => {
    state.sidebarSubmenu.isOpen = false;
    state.sidebarSubmenu.submenuId = null;
  },

  [t.RESET]: () => {
    purgeStoredState(CONFIG);
  },

  [t.ADD_AUTOFILL_REF]: (state, action) => {
    state.autofill[action.payload.ref] = action.payload.payload || null;
  },

  [t.REMOVE_AUTOFILL_REF]: (state, action) => {
    state.autofill = omit(state.autofill, [action.payload.ref]);
  },

  [t.RESET_AUTOFILL_REF]: (state, action) => {
    state.autofill = {};
  },
});

export default persistReducer(CONFIG, reducerInstance);

export const getDialogPayload = (state, dialogName) => {
  return typeof state.dashboard.dialogs[dialogName] !== 'undefined'
    ? state.dashboard.dialogs[dialogName].payload
    : {};
};

export const getDialogActiveStatus = (state, dialogName) => {
  return true;
};
