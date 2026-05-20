import { ADD_AUTOFILL_REF, APP_INTL_IS_LOADING, APP_IS_LOADING, CHANGE_DASHBOARD_PAGE_HINT, CHANGE_DASHBOARD_PAGE_TITLE, CLOSE_ALERT, CLOSE_DIALOG, CLOSE_DRAWER, OPEN_ALERT, OPEN_DIALOG, OPEN_DRAWER, REMOVE_AUTOFILL_REF, RESET_AUTOFILL_REF, SET_FEATURE_DASHBOARD_META, SIDEBAR_EXPEND_TOGGLE, SIDEBAR_SUBMENU_CLOSE, SIDEBAR_SUBMENU_OPEN, SPLASH_START_LOADING, SPLASH_STOP_LOADING } from '@/store/types';;

export function dashboardPageTitle(pageTitle: string) {
  return { type: CHANGE_DASHBOARD_PAGE_TITLE, pageTitle };
}
export function dashboardPageHint(pageHint: string) {
  return { type: CHANGE_DASHBOARD_PAGE_HINT, payload: { pageHint } };
}
export function openDialog(name: string, payload?: Record<string, unknown>) {
  return { type: OPEN_DIALOG, name, payload };
}
export function closeDialog(name: string, payload?: Record<string, unknown>) {
  return { type: CLOSE_DIALOG, name, payload };
}
export function openAlert(name: string, payload?: Record<string, unknown>) {
  return { type: OPEN_ALERT, name, payload };
}
export function closeAlert(name: string, payload?: Record<string, unknown>) {
  return { type: CLOSE_ALERT, name, payload };
}
export function openDrawer(name: string, payload?: Record<string, unknown>) {
  return { type: OPEN_DRAWER, name, payload };
}
export function closeDrawer(name: string, payload?: Record<string, unknown>) {
  return { type: CLOSE_DRAWER, name, payload };
}
export function toggleExpendSidebar(toggle?: boolean) {
  return { type: SIDEBAR_EXPEND_TOGGLE, payload: { toggle } };
}
export function appIsLoading(toggle: boolean) {
  return { type: APP_IS_LOADING, payload: { isLoading: toggle } };
}
export function appIntlIsLoading(toggle: boolean) {
  return { type: APP_INTL_IS_LOADING, payload: { isLoading: toggle } };
}
export function splashStartLoading() {
  return { type: SPLASH_START_LOADING };
}
export function splashStopLoading() {
  return { type: SPLASH_STOP_LOADING };
}
export const setFeatureDashboardMeta = ({
  features,
}: {
  features: Array<{ name: string; is_accessible: boolean }>;
}) => ({ type: SET_FEATURE_DASHBOARD_META, payload: { features } });

export function openSidebarSubmenu({ submenuId }: { submenuId: unknown }) {
  return { type: SIDEBAR_SUBMENU_OPEN, payload: { submenuId } };
}
export function closeSidebarSubmenu() {
  return { type: SIDEBAR_SUBMENU_CLOSE };
}
export function addAutofill(autofillRef: number, payload: unknown) {
  return { type: ADD_AUTOFILL_REF, payload: { ref: autofillRef, payload } };
}
export function removeAutofill(autofillRef: number) {
  return { type: REMOVE_AUTOFILL_REF, payload: { ref: autofillRef } };
}
export function resetAutofill() {
  return { type: RESET_AUTOFILL_REF };
}
export function changePreferencesPageTitle(pageTitle: string) {
  return { type: 'CHANGE_PREFERENCES_PAGE_TITLE', pageTitle };
}
