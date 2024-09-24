// @ts-nocheck
import t from '@/store/types';

export function dashboardPageTitle(pageTitle) {
  return {
    type: t.CHANGE_DASHBOARD_PAGE_TITLE,
    pageTitle,
  };
}

export function dashboardPageHint(pageHint) {
  return {
    type: t.CHANGE_DASHBOARD_PAGE_HINT,
    pageHint,
  };
}

export function openDialog(name, payload) {
  return {
    type: t.OPEN_DIALOG,
    name: name,
    payload: payload,
  };
}

export function closeDialog(name, payload) {
  return {
    type: t.CLOSE_DIALOG,
    name: name,
    payload: payload,
  };
}

export function openAlert(name, payload) {
  return {
    type: t.OPEN_ALERT,
    name,
    payload,
  };
}

export function closeAlert(name, payload) {
  return {
    type: t.CLOSE_ALERT,
    name,
    payload,
  };
}

export function openDrawer(name, payload) {
  return {
    type: t.OPEN_DRAWER,
    name,
    payload,
  };
}
export function closeDrawer(name, payload) {
  return {
    type: t.CLOSE_DRAWER,
    name,
    payload,
  };
}

/**
 * Toggles the sidebar expend.
 */
export function toggleExpendSidebar(toggle) {
  return {
    type: t.SIDEBAR_EXPEND_TOGGLE,
    payload: { toggle },
  };
}

export function appIsLoading(toggle) {
  return {
    type: t.APP_IS_LOADING,
    payload: { isLoading: toggle },
  };
}

export function appIntlIsLoading(toggle) {
  return {
    type: t.APP_INTL_IS_LOADING,
    payload: { isLoading: toggle },
  };
}

/**
 * Splash start loading.
 */
export function splashStartLoading() {
  return {
    type: t.SPLASH_START_LOADING,
  };
}

/**
 * Splash stop loading.
 */
export function splashStopLoading() {
  return {
    type: t.SPLASH_STOP_LOADING,
  };
}

export const setFeatureDashboardMeta = ({ features }) => {
  return {
    type: t.SET_FEATURE_DASHBOARD_META,
    payload: {
      features,
    },
  };
};

export function openSidebarSubmenu({ submenuId }) {
  return {
    type: t.SIDEBAR_SUBMENU_OPEN,
    payload: { submenuId },
  };
}

export function closeSidebarSubmenu() {
  return {
    type: t.SIDEBAR_SUBMENU_CLOSE,
  };
}

export function addAutofill(autofillRef: number, payload: any) {
  return {
    type: t.ADD_AUTOFILL_REF,
    payload: { ref: autofillRef, payload },
  };
}

export function removeAutofill(autofillRef: number) {
  return {
    type: t.REMOVE_AUTOFILL_REF,
    payload: { ref: autofillRef },
  };
}

export function resetAutofill() {
  return {
    type: t.RESET_AUTOFILL_REF,
  };
}

export function changePreferencesPageTitle(pageTitle: string) {
  return {
    type: 'CHANGE_PREFERENCES_PAGE_TITLE',
    pageTitle,
  };
}
