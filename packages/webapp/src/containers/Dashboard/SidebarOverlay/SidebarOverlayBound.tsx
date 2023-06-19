// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { SidebarOverlay } from './SidebarOverlay';
import withDashboardSidebarActions from '@/containers/Dashboard/Sidebar/withDashboardSidebarActions';
import withDashboardSidebar from '@/containers/Dashboard/Sidebar/withDashboardSidebar';

import { useSubSidebarMenu } from '../Sidebar/hooks';

/**
 * Dashboard sidebar menu.
 * @returns {JSX.Element}
 */
function SidebarOverlayBoundRoot({
  // #withDashboardSidebar
  sidebarSubmenuOpen,
  sidebarSubmenuId,

  // #withDashboardSidebarActions
  closeDashboardSidebarSubmenu,
}) {
  const handleSidebarClosing = React.useCallback(() => {
    closeDashboardSidebarSubmenu();
  }, []);

  return (
    <SidebarOverlayBoundRouter
      sidebarSubmenuId={sidebarSubmenuId}
      isOpen={sidebarSubmenuOpen}
      onClose={handleSidebarClosing}
    />
  );
}

/**
 * Dashboard sidebar submenu router.
 */
function SidebarOverlayBoundRouter({ sidebarSubmenuId, ...rest }) {
  const sidebarItems = useSubSidebarMenu(sidebarSubmenuId);

  return <SidebarOverlay items={sidebarItems} {...rest} />;
}

/**
 * Sidebar overlay bound with redux.
 */
export const SidebarOverlayBound = R.compose(
  withDashboardSidebar(({ sidebarSubmenuOpen, sidebarSubmenuId }) => ({
    sidebarSubmenuOpen,
    sidebarSubmenuId,
  })),
  withDashboardSidebarActions,
)(SidebarOverlayBoundRoot);
