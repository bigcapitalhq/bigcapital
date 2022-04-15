export enum ISidebarMenuItemType {
  Label = 'label',
  Link = 'link',
  Group = 'group',
  Overlay = 'overlay'
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
  | ISidebarMenuItemOverlay;
