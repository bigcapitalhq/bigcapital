import React from 'react';
import {Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import sidebarMenuList from 'config/sidebarMenu';

export default function SidebarMenu() {
  const items = sidebarMenuList.map((item) => 
    (item.divider) ? 
      <MenuDivider
        title={item.title} /> : 
      <MenuItem
        icon={item.icon}
        text={item.text}
        label={item.label}
        disabled={item.disabled} />
  );
  return (
    <Menu className="sidebar-menu">
      {items}
    </Menu>
  )
};
