import type { ReactNode } from 'react';

export interface PermissionOption {
  subject: string;
  ability: string;
}

export interface MenuItemOption {
  name: string;
  value: string;
}

export interface HomepageShortcutOption extends Partial<PermissionOption> {
  title: ReactNode;
  description: ReactNode;
  link: string;
}

export interface HomepageSectionOption {
  sectionTitle: ReactNode;
  shortcuts: HomepageShortcutOption[];
}

export interface PreferencesMenuItem {
  text: ReactNode;
  disabled?: boolean;
  href: string;
}

export interface QuickNewActionOption {
  path: string;
  name: string;
  permission: PermissionOption;
}

export interface ItemPaymentTransactionOption {
  name: string;
  label: string;
  permission: PermissionOption;
}

export interface KeyboardShortcutOption {
  shortcut_key: string;
  description: string;
  permission?: PermissionOption;
}
