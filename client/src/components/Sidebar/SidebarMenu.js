import React, { useMemo } from 'react';
import { Menu, MenuDivider, Button } from '@blueprintjs/core';
import { useHistory, useLocation } from 'react-router-dom';
import sidebarMenuList from 'config/sidebarMenu';
import Icon from 'components/Icon';
import MenuItem from 'components/MenuItem';
import { MenuItemLabel } from 'components';
import classNames from 'classnames';

export default function SidebarMenu() {
  const history = useHistory();
  const location = useLocation();

  const menuItemsMapper = (list) => {
    return list.map((item, index) => {
      const children = Array.isArray(item.children)
        ? menuItemsMapper(item.children)
        : null;

      const matchPath = (pathname, path) => {
        return item.matchExact ? pathname === path : pathname.indexOf(path) !== -1;
      };
      const isActive = (item.children) ?
        item.children.some((c) => matchPath(location.pathname, c.href)) :
        (item.href && matchPath(location.pathname, item.href));

      const handleItemClick = () => {
        if (item.href) {
          history.push(item.href);
        }
      };

      const maybeRenderLabel = (item) => item.newTabHref ? (
        <Button
          className="menu-item__add-btn"
          icon={<Icon icon={'plus'} iconSize={16} />}
          onClick={(event) => {
            history.push(item.newTabHref);
            event.stopPropagation();
          }}
        />
      ) : null;

      return item.spacer ? (
        <div class="bp3-menu-spacer"></div>
      ) : item.divider ? (
        <MenuDivider key={index} title={item.title} />
      ) : item.label ? (
        <MenuItemLabel key={index} text={item.text} />
      ) : (
        <MenuItem
          key={index}
          active={isActive}
          icon={<Icon icon={item.icon} iconSize={item.iconSize} />}
          text={item.text}
          label={maybeRenderLabel(item)}
          disabled={item.disabled}
          children={children}
          dropdownType={item.dropdownType || 'collapse'}
          caretIconSize={15}
          onClick={handleItemClick}
          callapseActive={!!isActive}
          itemClassName={classNames({
            'is-active': isActive,
            'has-icon': !children && item.icon,
          })}
        />
      );
    });
  };
  const items = menuItemsMapper(sidebarMenuList);

  return <Menu className="sidebar-menu">{items}</Menu>;
}
