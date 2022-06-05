import React from 'react';
import { Menu } from '@blueprintjs/core';
import * as R from 'ramda';

import { MenuItem, MenuItemLabel } from 'components';
import { ISidebarMenuItemType } from 'containers/Dashboard/Sidebar/interfaces';
import { useIsSidebarMenuItemActive } from './hooks';

import withSubscriptions from 'containers/Subscriptions/withSubscriptions';

/**
 * Sidebar menu item.
 * @returns {JSX.Element}
 */
function SidebarMenuItem({ item, index }) {
  // Detarmine whether the item is active.
  const isActive = useIsSidebarMenuItemActive(item);

  return (
    <MenuItem
      key={index}
      text={item.text}
      disabled={item.disabled}
      dropdownType={item.dropdownType || 'collapse'}
      caretIconSize={16}
      onClick={item.onClick}
      active={isActive}
      hasSubmenu={item.hasChildren}
    />
  );
}

SidebarMenuItem.ItemTypes = [
  ISidebarMenuItemType.Link,
  ISidebarMenuItemType.Overlay,
  ISidebarMenuItemType.Dialog,
];

/**
 * Detarmines which sidebar menu item type should display.
 * @returns {JSX.Element}
 */
function SidebarMenuItemComposer({ item, index }) {
  // Link item type.
  return SidebarMenuItem.ItemTypes.indexOf(item.type) !== -1 ? (
    <SidebarMenuItem item={item} index={index} />
  ) : // Group item type.
  item.type === ISidebarMenuItemType.Group ? (
    <MenuItemLabel text={item.text} />
  ) : null;
}

/**
 * Sidebar menu.
 * @returns {JSX.Element}
 */
function SidebarMenuJSX({ menu }) {
  return (
    <div>
      <Menu className="sidebar-menu">
        {menu.map((item, index) => (
          <SidebarMenuItemComposer index={index} item={item} />
        ))}
      </Menu>
    </div>
  );
}

export const SidebarMenu = R.compose(
  withSubscriptions(
    ({ isSubscriptionActive }) => ({ isSubscriptionActive }),
    'main',
  ),
)(SidebarMenuJSX);
