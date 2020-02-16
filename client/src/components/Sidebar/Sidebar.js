import React from 'react';
import SidebarContainer from 'components/Sidebar/SidebarContainer';
import SidebarHead from 'components/Sidebar/SidebarHead';
import SidebarMenu from 'components/Sidebar/SidebarMenu';

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