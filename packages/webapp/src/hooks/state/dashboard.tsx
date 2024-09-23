// @ts-nocheck
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
  splashStopLoading,
  splashStartLoading,
  dashboardPageTitle,
  openSidebarSubmenu,
  closeSidebarSubmenu,
  openDialog,
  closeDialog,
  openDrawer,
  closeDrawer,
  openAlert,
  closeAlert,
  changePreferencesPageTitle,
} from '@/store/dashboard/dashboard.actions';

export const useDispatchAction = (action) => {
  const dispatch = useDispatch();

  return useCallback(
    (payload) => {
      dispatch(action(payload));
    },
    [dispatch, action],
  );
};

export const useDashboardPageTitle = () => {
  return useDispatchAction(dashboardPageTitle);
};

/**
 * Splash loading screen actions.
 */
export const useSplashLoading = () => {
  return [
    useDispatchAction(splashStartLoading),
    useDispatchAction(splashStopLoading),
  ];
};

/**
 * Sidebar submenu actions.
 */
export const useSidebarSubmnuActions = () => {
  return {
    openSidebarSubmenu: useDispatchAction(openSidebarSubmenu),
    closeSidebarSubmenu: useDispatchAction(closeSidebarSubmenu),
    toggleSidebarSubmenu: useDispatchAction(openSidebarSubmenu),
  };
};

/**
 * Retrieves the sidebar submenu selector.
 */
const sidebarSubmenuSelector = createSelector(
  (state) => state.dashboard.sidebarSubmenu,
  (sidebarSubmenu) => sidebarSubmenu,
);

/**
 * Retrieves the sidebar submenu selector.
 */
export const useSidebarSubmenu = () => {
  const sidebarSubmenu = useSelector(sidebarSubmenuSelector);

  return {
    isOpen: sidebarSubmenu?.isOpen || false,
    submenuId: sidebarSubmenu?.submenuId || null,
  };
};

/**
 * Dialogs actions.
 */
export const useDialogActions = () => {
  return {
    openDialog: useDispatchAction(openDialog),
    closeDialog: useDispatchAction(closeDialog),
  };
};

/**
 * Drawer actions.
 * @returns
 */
export const useDrawerActions = () => {
  const dispatch = useDispatch();

  return {
    openDrawer: (name, payload?: {}) => dispatch(openDrawer(name, payload)),
    closeDrawer: (name, payload?: {}) => dispatch(closeDrawer(name, payload)),
  };
};

/**
 * Alert actions.
 * @returns
 */
export const useAlertActions = () => {
  const dispatch = useDispatch();

  return {
    openAlert: (name, payload?: {}) => dispatch(openAlert(name, payload)),
    closeAlert: (name, payload?: {}) => dispatch(closeAlert(name, payload)),
  };
};

export const useChangePreferencesPageTitle = () => {
  return useDispatchAction(changePreferencesPageTitle);
};
