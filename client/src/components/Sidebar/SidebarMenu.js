import React, { useState } from 'react';
import {Menu, MenuDivider, Collapse} from "@blueprintjs/core";
import {useHistory} from 'react-router-dom';
import sidebarMenuList from 'config/sidebarMenu';
import Icon from 'components/Icon';
import MenuItem from 'components/MenuItem';

export default function SidebarMenu() {
  let history = useHistory();

  const menuItemsMapper = (list) => {
    return list.map((item, index) => {
      const children = Array.isArray(item.children) ? menuItemsMapper(item.children) : null;

      return (
        (item.divider) ? 
          <MenuDivider
            title={item.title} /> : 
          <MenuItem
            icon={<Icon icon={item.icon} iconSize={item.iconSize} />}
            text={item.text}
            label={item.label}
            disabled={item.disabled}
            children={children}
            dropdownType={item.dropdownType || 'collapse'}
            onClick={() => {
              if (item.href) {
                history.push(item.href);
              }              
            }} />
      );
    });
  };
  const items = menuItemsMapper(sidebarMenuList);
  
  return (<Menu className="sidebar-menu">{items}</Menu>);
};
