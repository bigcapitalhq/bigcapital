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
export const useSidebarSubmenuActions = () => {
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
