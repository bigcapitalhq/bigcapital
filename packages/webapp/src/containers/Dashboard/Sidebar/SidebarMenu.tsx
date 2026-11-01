import { Intent, Menu } from '@blueprintjs/core';
import React from 'react';
import { useIsSidebarMenuItemActive } from './hooks';
import type { ISidebarMenuItem } from '@/containers/Dashboard/Sidebar/interfaces';
import { MenuItem, MenuItemLabel } from '@/components';
import { ISidebarMenuItemType } from '@/containers/Dashboard/Sidebar/interfaces';

interface SidebarMenuItemProps {
  item: ISidebarMenuItem;
  index: number;
}

interface SidebarMenuItemComponentProps {
  text?: React.ReactNode;
  disabled?: boolean;
  dropdownType?: string;
  onClick?: (event: React.MouseEvent) => void;
  active?: boolean;
  intent?: Intent;
}

// The shared `MenuItem` is a class component with untyped props (a forked and
// customized Blueprint menu item); this boundary cast keeps its props checked
// at the usage sites below.
const SidebarMenuItemComponent =
  MenuItem as unknown as React.ComponentType<SidebarMenuItemComponentProps>;

/**
 * Sidebar menu item.
 * @returns {JSX.Element}
 */
function SidebarMenuItem({ item, index }: SidebarMenuItemProps) {
  // Detarmine whether the item is active.
  const isActive = useIsSidebarMenuItemActive(item);

  return (
    <SidebarMenuItemComponent
      key={index}
      text={item.text}
      disabled={item.disabled}
      dropdownType={item.dropdownType || 'collapse'}
      onClick={item.onClick}
      active={isActive}
      intent={Intent.NONE}
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
function SidebarMenuItemComposer({ item, index }: SidebarMenuItemProps) {
  // Link item type.
  return SidebarMenuItem.ItemTypes.indexOf(item.type) !== -1 ? (
    <SidebarMenuItem item={item} index={index} />
  ) : // Group item type.
  item.type === ISidebarMenuItemType.Group ? (
    <MenuItemLabel text={item.text} />
  ) : null;
}

interface SidebarMenuProps {
  menu: ISidebarMenuItem[];
}

/**
 * Sidebar menu.
 * @returns {JSX.Element}
 */
export function SidebarMenu({ menu }: SidebarMenuProps) {
  return (
    <div>
      <Menu className="sidebar-menu">
        {menu.map((item, index) => (
          <SidebarMenuItemComposer key={index} index={index} item={item} />
        ))}
      </Menu>
    </div>
  );
}
