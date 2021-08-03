import React from 'react';
import { Menu, MenuDivider } from '@blueprintjs/core';
import { useHistory, useLocation } from 'react-router-dom';
import sidebarMenuList from 'config/sidebarMenu';
import { Choose } from 'components';
import Icon from 'components/Icon';
import MenuItem from 'components/MenuItem';
import { MenuItemLabel } from 'components';
import classNames from 'classnames';
import SidebarOverlay from 'components/SidebarOverlay';

const DEFAULT_ITEM = {
  text: '',
  href: '',
};

function matchPath(pathname, path, matchExact) {
  return matchExact ? pathname === path : pathname.indexOf(path) !== -1;
}

function SidebarMenuItemSpace({ space }) {
  return (
    <div class="bp3-menu-spacer" style={{ height: `${space}px` }} />
  )
}

export default function SidebarMenu() {
  const history = useHistory();
  const location = useLocation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(null);

  const menuItemsMapper = (list) => {
    return list.map((item, index) => {
      const hasChildren = Array.isArray(item.children);

      const isActive =
        (item.children
          ? item.children.some((c) =>
              matchPath(location.pathname, c.href, item.matchExact),
            )
          : item.href &&
            matchPath(location.pathname, item.href, item.matchExact)) ||
        currentItem === item;

      const handleItemClick = () => {
        if (item.href) {
          history.push(item.href);
        }
        if (item.children && item.children.length > 0) {
          setIsOpen(true);
          setCurrentItem(item);
        } else {
          setIsOpen(false);
        }
      };

      return (
        <Choose>
          <Choose.When condition={item.spacer}>
            <SidebarMenuItemSpace space={item.spacer} />
          </Choose.When>

          <Choose.When condition={item.divider}>
            <MenuDivider key={index} title={item.title} />
          </Choose.When>

          <Choose.When condition={item.label}>
            <MenuItemLabel key={index} text={item.text} />
          </Choose.When>

          <Choose.Otherwise>
            <MenuItem
              key={index}
              active={isActive}
              icon={<Icon icon={item.icon} iconSize={item.iconSize} />}
              text={item.text}
              disabled={item.disabled}
              dropdownType={item.dropdownType || 'collapse'}
              caretIconSize={16}
              onClick={handleItemClick}
              callapseActive={!!isActive}
              itemClassName={classNames({
                'is-active': isActive,
                'has-icon': !hasChildren && item.icon,
              })}
              hasSubmenu={hasChildren}
            />
          </Choose.Otherwise>
        </Choose>
      );
    });
  };
  const items = menuItemsMapper(sidebarMenuList);

  const handleSidebarOverlayClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Menu className="sidebar-menu">{items}</Menu>{' '}
      <SidebarOverlay
        isOpen={isOpen}
        label={currentItem?.text || ''}
        items={currentItem?.children || []}
        onClose={handleSidebarOverlayClose}
      />
    </div>
  );
}
