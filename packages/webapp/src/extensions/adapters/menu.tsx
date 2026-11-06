import React from 'react';
import { resolveExtensionMenuHref, type RegisteredMenuItem } from '../registry';
import type { SidebarMenuItem } from '@/constants/sidebarMenu';
import type { MenuContribution } from '@bigcapital/extension-sdk/web';
import { FormattedMessage as T } from '@/components/FormattedMessage';
import { ISidebarMenuItemType } from '@/containers/Dashboard/Sidebar/interfaces';

export interface ExtensionSidebarMenuItem extends SidebarMenuItem {
  parentId?: string;
  afterId?: string;
}

/**
 * Converts an extension menu contribution to the host sidebar item shape.
 */
export function toSidebarMenuItem(
  item: RegisteredMenuItem,
): ExtensionSidebarMenuItem {
  return convertMenuItem(item, item.extensionId);
}

function convertMenuItem(
  item: MenuContribution,
  extensionId: string,
): ExtensionSidebarMenuItem {
  const text =
    typeof item.text === 'string' ? (
      item.text
    ) : (
      <T id={`ext.${extensionId}.${item.text.i18n}`} />
    );

  const permission = item.permission
    ? {
        subject: item.permission.subject,
        ability: item.permission.action,
      }
    : undefined;

  const children = item.children?.map((child) =>
    convertMenuItem(child, extensionId),
  );

  const base = {
    id: item.id,
    text,
    feature: item.feature,
    permission,
    parentId: item.parentId,
    afterId: item.afterId,
  };

  if (children && children.length > 0) {
    return {
      ...base,
      type: ISidebarMenuItemType.Group,
      children,
    };
  }

  if (item.href) {
    return {
      ...base,
      type: ISidebarMenuItemType.Link,
      href: resolveExtensionMenuHref(extensionId, item.href)!,
      matchExact: true,
    };
  }

  return {
    ...base,
    type: ISidebarMenuItemType.Label,
  };
}

/**
 * Merges extension menu items into the core menu using `parentId`/`afterId`
 * anchors. Items with unknown anchors are appended at the top level so a bad
 * anchor never hides an extension entirely.
 */
export function mergeSidebarMenu(
  coreMenu: SidebarMenuItem[],
  extensionMenu: ExtensionSidebarMenuItem[],
): SidebarMenuItem[] {
  const menu = cloneMenu(coreMenu);

  extensionMenu.forEach((item) => {
    if (item.parentId && insertIntoParent(menu, item.parentId, item)) {
      return;
    }

    if (item.parentId) {
      console.warn(
        `Extension menu item "${item.id}" references unknown parent "${item.parentId}". Appending at the top level.`,
      );
    }

    insertSibling(menu, item, item.afterId);
  });

  return menu;
}

function cloneMenu(items: SidebarMenuItem[]): SidebarMenuItem[] {
  return items.map((item) => ({
    ...item,
    children: item.children ? cloneMenu(item.children) : undefined,
  }));
}

function insertIntoParent(
  items: SidebarMenuItem[],
  parentId: string,
  item: SidebarMenuItem,
): boolean {
  for (const current of items) {
    if (current.id === parentId) {
      current.children = insertSibling(
        current.children ?? [],
        item,
        (item as ExtensionSidebarMenuItem).afterId,
      );
      return true;
    }

    if (
      current.children &&
      insertIntoParent(current.children, parentId, item)
    ) {
      return true;
    }
  }

  return false;
}

function insertSibling(
  items: SidebarMenuItem[],
  item: SidebarMenuItem,
  afterId?: string,
): SidebarMenuItem[] {
  if (!afterId) {
    items.push(item);
    return items;
  }

  const index = items.findIndex((current) => current.id === afterId);

  if (index === -1) {
    console.warn(
      `Extension menu item "${item.id}" references unknown sibling "${afterId}". Appending.`,
    );
    items.push(item);
    return items;
  }

  items.splice(index + 1, 0, item);
  return items;
}
