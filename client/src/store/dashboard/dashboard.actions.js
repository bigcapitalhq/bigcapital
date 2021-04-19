import t from 'store/types';

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
    payload: { toggle }
  };
}