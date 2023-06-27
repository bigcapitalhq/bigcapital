// @ts-nocheck
import React from 'react';

import { SidebarContainer } from './SidebarContainer';
import { SidebarHead } from './SidebarHead';
import { SidebarMenu } from './SidebarMenu';
import { useMainSidebarMenu } from './hooks';
import { SidebarOverlayBound } from '../SidebarOverlay';

import '@/style/containers/Dashboard/Sidebar.scss';

/**
 * Dashboard sidebar.
 * @returns {JSX.Element}
 */
export function Sidebar() {
  const menu = useMainSidebarMenu();

  return (
    <SidebarContainer>
      <SidebarHead />

      <div className="sidebar__menu">
        <SidebarMenu menu={menu} />
      </div>
      <SidebarOverlayBound />
      <SidebarFooterVersion />
    </SidebarContainer>
  );
}

/**
 * Sidebar footer version.
 * @returns {React.JSX}
 */
function SidebarFooterVersion() {
  const { MONOREPO_VERSION } = process.env;

  if (!MONOREPO_VERSION) {
    return null;
  }
  return <div class="sidebar__version">v{MONOREPO_VERSION}</div>;
}
