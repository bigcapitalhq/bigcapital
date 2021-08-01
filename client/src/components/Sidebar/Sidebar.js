import React from 'react';
import SidebarContainer from 'components/Sidebar/SidebarContainer';
import SidebarHead from 'components/Sidebar/SidebarHead';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import SidebarOverlay from 'components/SidebarOverlay';

import 'style/containers/Dashboard/Sidebar.scss';

export default function Sidebar({ dashboardContentRef }) {
  return (
    <SidebarContainer>
      <SidebarHead />

      <div className="sidebar__menu">
        <SidebarMenu />
      </div>

      <div class="sidebar__version">0.0.1-beta version.</div>
    </SidebarContainer>
  );
}
