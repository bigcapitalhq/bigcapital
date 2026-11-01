import * as FF from 'fp-ts/function';
import React from 'react';
import { useSubSidebarMenu } from '../Sidebar/hooks';
import { SidebarOverlay, SidebarOverlayProps } from './SidebarOverlay';
import {
  withDashboardSidebar,
  WithDashboardSidebarProps,
} from '@/containers/Dashboard/Sidebar/withDashboardSidebar';
import {
  withDashboardSidebarActions,
  WithDashboardSidebarActionsProps,
} from '@/containers/Dashboard/Sidebar/withDashboardSidebarActions';

interface SidebarOverlayBindedRootProps
  extends Pick<
      WithDashboardSidebarProps,
      'sidebarSubmenuOpen' | 'sidebarSubmenuId'
    >,
    Pick<WithDashboardSidebarActionsProps, 'closeDashboardSidebarSubmenu'> {}

/**
 * Dashboard sidebar menu.
 * @returns {JSX.Element}
 */
function SidebarOverlayBindedRoot({
  // #withDashboardSidebar
  sidebarSubmenuOpen,
  sidebarSubmenuId,

  // #withDashboardSidebarActions
  closeDashboardSidebarSubmenu,
}: SidebarOverlayBindedRootProps) {
  const handleSidebarClosing = React.useCallback(() => {
    closeDashboardSidebarSubmenu();
  }, []);

  return (
    <SidebarOverlayBindedRouter
      sidebarSubmenuId={sidebarSubmenuId}
      isOpen={sidebarSubmenuOpen}
      onClose={handleSidebarClosing}
    />
  );
}

interface SidebarOverlayBindedRouterProps
  extends Omit<SidebarOverlayProps, 'items'> {
  sidebarSubmenuId: unknown;
}

/**
 * Dashboard sidebar submenu router.
 */
function SidebarOverlayBindedRouter({
  sidebarSubmenuId,
  ...rest
}: SidebarOverlayBindedRouterProps) {
  const sidebarItems = useSubSidebarMenu(sidebarSubmenuId);

  return <SidebarOverlay items={sidebarItems} {...rest} />;
}

/**
 * Sidebar overlay binded with redux.
 */
export const SidebarOverlayBinded = FF.pipe(
  SidebarOverlayBindedRoot,
  withDashboardSidebarActions,
  withDashboardSidebar(
    ({ sidebarSubmenuOpen, sidebarSubmenuId }: WithDashboardSidebarProps) => ({
      sidebarSubmenuOpen,
      sidebarSubmenuId,
    }),
  ),
);
