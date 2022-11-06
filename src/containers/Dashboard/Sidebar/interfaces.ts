// @ts-nocheck
export enum ISidebarMenuItemType {
  Label = 'label',
  Link = 'link',
  Group = 'group',
  Overlay = 'overlay',
  Dialog = 'dialog',
  Drawer = 'drawer',
}

export interface ISidebarMenuItemOverlay extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Overlay;
}

export interface ISidebarMenuItemLink extends ISidebarMenuItemCommon {
  text: string | JSX.Element;
  href: string;
  type: ISidebarMenuItemType.Link;
  matchExact?: boolean;
}

export interface ISidebarMenuItemDialog extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Dialog;
  dialogName: string;
  dialogPayload: any;
}

export interface ISidebarMenuItemDrawer extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Drawer;
  drawerName: string;
  drawerPayload: any;
}

export interface ISidebarMenuItemLabel extends ISidebarMenuItemCommon {
  text?: string;
  type: ISidebarMenuItemType.Label;
}

export interface ISidebarMenuItemGroup extends ISidebarMenuItemCommon {
  type: ISidebarMenuItemType.Group;
}

export interface ISidebarMenuItemPermission {
  subject: string;
  ability: string;
}

export interface ISidebarMenuItemCommon {
  ability?: ISidebarMenuItemPermission | ISidebarMenuItemPermission[];
  feature?: string;
  disabled?: boolean;
  children?: ISidebarMenuItem[];
  onlySubscriptionExpired?: boolean;
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
  Projects = 'Projects',
}

export enum ISidebarSubscriptionAbility {
  Expired = 'SubscriptionExpired',
  Active = 'SubscriptionActive',
}
