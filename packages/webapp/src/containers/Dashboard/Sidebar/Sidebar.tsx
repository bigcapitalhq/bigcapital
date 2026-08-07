// @ts-nocheck
import React from 'react';
import { SidebarOverlayBinded } from '../SidebarOverlay';
import { useMainSidebarMenu } from './hooks';
import { SidebarContainer } from './SidebarContainer';
import { SidebarHead } from './SidebarHead';
import { SidebarMenu } from './SidebarMenu';

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
      <SidebarOverlayBinded />
      <SidebarFooterVersion />
    </SidebarContainer>
  );
}

/**
 * Sidebar footer version.
 * @returns {React.JSX}
 */
function SidebarFooterVersion() {
  const { REACT_APP_VERSION } = process.env;

  if (!REACT_APP_VERSION) {
    return null;
  }
  return <div class="sidebar__version">v{REACT_APP_VERSION}</div>;
}
