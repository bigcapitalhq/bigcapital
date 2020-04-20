import React, { useState } from 'react';
import {Menu, MenuDivider, Collapse} from "@blueprintjs/core";
import {useHistory, useLocation} from 'react-router-dom';
import sidebarMenuList from 'config/sidebarMenu';
import Icon from 'components/Icon';
import MenuItem from 'components/MenuItem';
import classNames from 'classnames';

export default function SidebarMenu() {
  const history = useHistory();
  const location = useLocation();

  const menuItemsMapper = (list) => {
    return list.map((item, index) => {
      const children = Array.isArray(item.children) ? menuItemsMapper(item.children) : null;
      const isActive = (item.href && item.href === location.pathname) ||
        (item.children && item.children.some((c) => c.href === location.pathname));

      const handleItemClick = () => {
        if (item.href) { history.push(item.href); }
      };
      return (
        (item.divider) ? 
          <MenuDivider title={item.title} /> :
          <MenuItem
            active={isActive}
            icon={<Icon icon={item.icon} iconSize={item.iconSize} />}
            text={item.text}
            label={item.label}
            disabled={item.disabled}
            children={children}
            dropdownType={item.dropdownType || 'collapse'}
            caretIconSize={15}
            onClick={handleItemClick}
            // callapseActive={!!isActive}
            className={classNames({ 'is-active': isActive })} />
      );
    });
  };
  const items = menuItemsMapper(sidebarMenuList);
  
  return (<Menu className="sidebar-menu">{items}</Menu>);
};
