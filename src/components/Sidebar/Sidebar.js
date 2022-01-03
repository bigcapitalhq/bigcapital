import React from 'react';

import SidebarContainer from 'components/Sidebar/SidebarContainer';
import SidebarHead from 'components/Sidebar/SidebarHead';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import { useGetSidebarMenu } from './utils';

import 'style/containers/Dashboard/Sidebar.scss';

export default function Sidebar({ dashboardContentRef }) {
  const menu = useGetSidebarMenu();

  return (
    <SidebarContainer>
      <SidebarHead />

      <div className="sidebar__menu">
        <SidebarMenu menu={menu} />
      </div>

      <SidebarFooterVersion />
    </SidebarContainer>
  );
}

/**
 * Sidebar footer version. 
 * @returns {React.JSX}
 */
function SidebarFooterVersion() {
  const { REACT_APP_VERSION: VERSION } = process.env;

  if (!VERSION) {
    return null;
  }
  return <div class="sidebar__version">v{VERSION}</div>;
}
