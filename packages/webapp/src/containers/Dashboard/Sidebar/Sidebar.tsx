import React from 'react';

import { SidebarContainer } from './SidebarContainer';
import { SidebarHead } from './SidebarHead';
import { SidebarMenu } from './SidebarMenu';
import { useMainSidebarMenu } from './hooks';
import { SidebarOverlayBinded } from '../SidebarOverlay';

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
  
  const { REACT_APP_VERSION } = import.meta.env;

  if (!REACT_APP_VERSION) {
    return null;
  }
  return <div className="sidebar__version">v{REACT_APP_VERSION}</div>;
}
