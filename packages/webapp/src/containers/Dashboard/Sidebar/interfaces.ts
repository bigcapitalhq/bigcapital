import type { MouseEvent, ReactNode } from 'react';

export enum ISidebarMenuItemType {
  Label = 'label',
  Link = 'link',
  Group = 'group',
  Overlay = 'overlay',
  Dialog = 'dialog',
  Drawer = 'drawer',
}

export interface ISidebarMenuItemCommon {
  ability?: ISidebarMenuItemPermission | ISidebarMenuItemPermission[];
  permission?: ISidebarMenuItemPermission;
  feature?: string;
  disabled?: boolean;
  children?: ISidebarMenuItem[];
  onlySubscriptionExpired?: boolean;
  subscription?: ISidebarSubscriptionAbility[];
  overlayId?: ISidebarMenuOverlayIds;
  dialogName?: string;
  dialogPayload?: any;
  drawerName?: string;
  drawerPayload?: any;
  divider?: boolean;
  matchExact?: boolean;
  dropdownType?: string;
  hasChildren?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export interface ISidebarMenuItemOverlay extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Overlay;
  text: ReactNode;
  overlayId: ISidebarMenuOverlayIds;
}

export interface ISidebarMenuItemLink extends ISidebarMenuItemCommon {
  text: ReactNode;
  href: string;
  type: ISidebarMenuItemType.Link;
}

export interface ISidebarMenuItemDialog extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Dialog;
  text: ReactNode;
  href: string;
  dialogName: string;
  dialogPayload?: any;
}

export interface ISidebarMenuItemDrawer extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Drawer;
  text?: ReactNode;
  drawerName: string;
  drawerPayload?: any;
}

export interface ISidebarMenuItemLabel extends ISidebarMenuItemCommon {
  text?: ReactNode;
  type: ISidebarMenuItemType.Label;
}

export interface ISidebarMenuItemGroup extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Group;
  text: ReactNode;
}

export interface ISidebarMenuItemPermission {
  subject: string;
  ability: string;
}

export type ISidebarMenuItem =
  | ISidebarMenuItemLink
  | ISidebarMenuItemLabel
  | ISidebarMenuItemGroup
  | ISidebarMenuItemOverlay
  | ISidebarMenuItemDialog
  | ISidebarMenuItemDrawer;

export enum ISidebarMenuOverlayIds {
  Items = 'Items',
  Reports = 'Reports',
  Sales = 'Sales',
  Purchases = 'Purchases',
  Financial = 'Financial',
  Contacts = 'Contacts',
  Cashflow = 'Cashflow',
  Expenses = 'Expenses',
}

export enum ISidebarSubscriptionAbility {
  Expired = 'SubscriptionExpired',
  Active = 'SubscriptionActive',
}
