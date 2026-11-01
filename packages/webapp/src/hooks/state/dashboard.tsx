import { useCallback } from 'react';
import { createSelector } from 'reselect';
import type { RootState } from '@/store/reducers';
import type { AnyAction } from 'redux';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useDispatchAction = <P extends unknown[], A extends AnyAction>(
  action: (...args: P) => A,
) => {
  const dispatch = useAppDispatch();

  return useCallback(
    (...args: P) => {
      dispatch(action(...args));
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
  (state: RootState) => state.dashboard.sidebarSubmenu,
  (sidebarSubmenu) => sidebarSubmenu,
);

/**
 * Retrieves the sidebar submenu selector.
 */
export const useSidebarSubmenu = () => {
  const sidebarSubmenu = useAppSelector(sidebarSubmenuSelector);

  return {
    isOpen: sidebarSubmenu?.isOpen || false,
    submenuId: sidebarSubmenu?.submenuId || null,
  };
};

/**
 * Dialogs actions.
 */
export const useDialogActions = () => {
  const dispatch = useAppDispatch();

  return {
    openDialog: (name: string, payload?: Record<string, unknown>) =>
      dispatch(openDialog(name, payload)),
    closeDialog: (name: string, payload?: Record<string, unknown>) =>
      dispatch(closeDialog(name, payload)),
  };
};

/**
 * Drawer actions.
 * @returns
 */
export const useDrawerActions = () => {
  const dispatch = useAppDispatch();

  return {
    openDrawer: (name: string, payload?: Record<string, unknown>) =>
      dispatch(openDrawer(name, payload)),
    closeDrawer: (name: string, payload?: Record<string, unknown>) =>
      dispatch(closeDrawer(name, payload)),
  };
};

/**
 * Alert actions.
 * @returns
 */
export const useAlertActions = () => {
  const dispatch = useAppDispatch();

  return {
    openAlert: (name: string, payload?: Record<string, unknown>) =>
      dispatch(openAlert(name, payload)),
    closeAlert: (name: string, payload?: Record<string, unknown>) =>
      dispatch(closeAlert(name, payload)),
  };
};

export const useChangePreferencesPageTitle = () => {
  return useDispatchAction(changePreferencesPageTitle);
};
