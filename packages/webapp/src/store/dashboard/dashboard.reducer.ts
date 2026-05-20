import { createReducer } from '@reduxjs/toolkit';
import { isUndefined, isNumber, omit } from 'lodash';
import { ADD_AUTOFILL_REF, ALTER_DASHBOARD_PAGE_SUBTITLE, CHANGE_DASHBOARD_PAGE_HINT, CHANGE_DASHBOARD_PAGE_TITLE, CHANGE_PREFERENCES_PAGE_TITLE, CLOSE_ALERT, CLOSE_ALL_DIALOGS, CLOSE_DIALOG, CLOSE_DRAWER, OPEN_ALERT, OPEN_DIALOG, OPEN_DRAWER, REMOVE_AUTOFILL_REF, RESET, RESET_AUTOFILL_REF, SET_DASHBOARD_BACK_LINK, SET_FEATURE_DASHBOARD_META, SET_TOPBAR_EDIT_VIEW, SIDEBAR_EXPEND_TOGGLE, SIDEBAR_SUBMENU_CLOSE, SIDEBAR_SUBMENU_OPEN, SPLASH_START_LOADING, SPLASH_STOP_LOADING } from '@/store/types';;
import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface OverlayEntry {
  isOpen: boolean;
  payload: Record<string, unknown>;
}

export interface DashboardState {
  pageTitle: string;
  pageSubtitle: string;
  pageHint: string;
  preferencesPageTitle: string;
  sidebarExpended: boolean;
  dialogs: Record<string, OverlayEntry>;
  alerts: Record<string, OverlayEntry>;
  drawers: Record<string, OverlayEntry>;
  topbarEditViewId: unknown;
  requestsLoading: number;
  backLink: boolean;
  splashScreenLoading: number | null;
  appIsLoading: boolean;
  appIntlIsLoading: boolean;
  sidebarSubmenu: { isOpen: boolean; submenuId: unknown };
  features: Record<string, boolean>;
  autofill: Record<string, unknown>;
}

const initialState: DashboardState = {
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
const CONFIG = { key: STORAGE_KEY, whitelist: [], storage };

type DashboardAction = { type: string; payload?: Record<string, unknown>; [key: string]: unknown };

const reducerInstance = createReducer(initialState, {
  [CHANGE_DASHBOARD_PAGE_TITLE]: (state: DashboardState, action: DashboardAction) => {
    state.pageTitle = action.pageTitle as string;
  },
  [ALTER_DASHBOARD_PAGE_SUBTITLE]: (state: DashboardState, action: DashboardAction) => {
    state.pageSubtitle = action.pageSubtitle as string;
  },
  [CHANGE_DASHBOARD_PAGE_HINT]: (state: DashboardState, action: DashboardAction) => {
    state.pageHint = (action.payload as { pageHint: string }).pageHint;
  },
  [CHANGE_PREFERENCES_PAGE_TITLE]: (state: DashboardState, action: DashboardAction) => {
    state.preferencesPageTitle = action.pageTitle as string;
  },
  [OPEN_DIALOG]: (state: DashboardState, action: DashboardAction) => {
    state.dialogs[action.name as string] = {
      isOpen: true,
      payload: (action.payload || {}) as Record<string, unknown>,
    };
  },
  [CLOSE_DIALOG]: (state: DashboardState, action: DashboardAction) => {
    state.dialogs[action.name as string] = {
      ...state.dialogs[action.name as string],
      isOpen: false,
    };
  },
  [OPEN_ALERT]: (state: DashboardState, action: DashboardAction) => {
    state.alerts[action.name as string] = {
      isOpen: true,
      payload: (action.payload || {}) as Record<string, unknown>,
    };
  },
  [CLOSE_ALERT]: (state: DashboardState, action: DashboardAction) => {
    state.alerts[action.name as string] = {
      ...state.alerts[action.name as string],
      isOpen: false,
    };
  },
  [OPEN_DRAWER]: (state: DashboardState, action: DashboardAction) => {
    state.drawers[action.name as string] = {
      isOpen: true,
      payload: (action.payload || {}) as Record<string, unknown>,
    };
  },
  [CLOSE_DRAWER]: (state: DashboardState, action: DashboardAction) => {
    state.drawers[action.name as string] = {
      ...state.drawers[action.name as string],
      isOpen: false,
    };
  },
  [CLOSE_ALL_DIALOGS]: () => {},
  [SET_TOPBAR_EDIT_VIEW]: (state: DashboardState, action: DashboardAction) => {
    state.topbarEditViewId = action.id;
  },
  [SIDEBAR_EXPEND_TOGGLE]: (state: DashboardState, action: DashboardAction) => {
    const { toggle } = (action.payload || {}) as { toggle?: boolean };
    state.sidebarExpended = isUndefined(toggle) ? !state.sidebarExpended : !!toggle;
  },
  [SET_DASHBOARD_BACK_LINK]: (state: DashboardState, action: DashboardAction) => {
    const { backLink } = (action.payload || {}) as { backLink: boolean };
    state.backLink = backLink;
  },
  [SPLASH_START_LOADING]: (state: DashboardState) => {
    if (isNumber(state.splashScreenLoading)) {
      state.splashScreenLoading += 1;
    } else {
      state.splashScreenLoading = 1;
    }
  },
  [SET_FEATURE_DASHBOARD_META]: (state: DashboardState, action: DashboardAction) => {
    const { features } = (action.payload || {}) as { features: Array<{ name: string; is_accessible: boolean }> };
    const _data: Record<string, boolean> = {};
    features.forEach((feature) => {
      _data[feature.name] = feature.is_accessible;
    });
    state.features = _data;
  },
  [SPLASH_STOP_LOADING]: (state: DashboardState) => {
    state.splashScreenLoading = Math.max((state.splashScreenLoading ?? 0) - 1, 0);
  },
  [SIDEBAR_SUBMENU_OPEN]: (state: DashboardState, action: DashboardAction) => {
    state.sidebarSubmenu.isOpen = true;
    state.sidebarSubmenu.submenuId = (action.payload as { submenuId: unknown })?.submenuId;
  },
  [SIDEBAR_SUBMENU_CLOSE]: (state: DashboardState) => {
    state.sidebarSubmenu.isOpen = false;
    state.sidebarSubmenu.submenuId = null;
  },
  [RESET]: () => {
    purgeStoredState(CONFIG);
  },
  [ADD_AUTOFILL_REF]: (state: DashboardState, action: DashboardAction) => {
    const { ref, payload } = (action.payload || {}) as { ref: string; payload: unknown };
    state.autofill[ref] = payload || null;
  },
  [REMOVE_AUTOFILL_REF]: (state: DashboardState, action: DashboardAction) => {
    const { ref } = (action.payload || {}) as { ref: string };
    state.autofill = omit(state.autofill, [ref]);
  },
  [RESET_AUTOFILL_REF]: (state: DashboardState) => {
    state.autofill = {};
  },
});

export const dashboardPersistReducer = persistReducer(CONFIG, reducerInstance);

export const getDialogPayload = (
  state: { dashboard: DashboardState },
  dialogName: string,
) => {
  return typeof state.dashboard.dialogs[dialogName] !== 'undefined'
    ? state.dashboard.dialogs[dialogName].payload
    : {};
};

export const getDialogActiveStatus = (
  _state: { dashboard: DashboardState },
  _dialogName: string,
) => true;
