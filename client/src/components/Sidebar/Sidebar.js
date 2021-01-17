import React from 'react';
import SidebarContainer from 'components/Sidebar/SidebarContainer';
import SidebarHead from 'components/Sidebar/SidebarHead';
import SidebarMenu from 'components/Sidebar/SidebarMenu';

import 'style/containers/Dashboard/Sidebar.scss';

export default function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarHead />
      
      <div className="sidebar__menu">
        <SidebarMenu />
      </div>
    </SidebarContainer>
  )
}