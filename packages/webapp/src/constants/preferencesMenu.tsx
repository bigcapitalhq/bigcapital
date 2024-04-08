import React from 'react';
import { FormattedMessage as T } from '@/components';

export interface IMenuItem {
  text: React.ReactNode; // since you're using <T id={'...'} /> for internationalization
  href?: string;
  disabled?: boolean;
  label?: React.ReactNode; // Assuming it could also be internationalized or icon etc.
}

export interface IMenuDivider {
  divider: true;
  title?: string; // Assuming dividers might have titles
}

export type PreferencesMenuItem = IMenuItem | IMenuDivider;


const preferencesMenu: PreferencesMenuItem[] = [
  {
    text: <T id={'general'} />,
    disabled: false,
    href: '/preferences/general',
  },
  {
    text: <T id={'users'} />,
    href: '/preferences/users',
  },
  {
    text: <T id={'preferences.estimates'} />,
    href: '/preferences/estimates',
  },
  {
    text: <T id={'preferences.invoices'} />,
    href: '/preferences/invoices',
  },
  {
    text: <T id={'preferences.receipts'} />,
    href: '/preferences/receipts',
  },
  {
    text: <T id={'preferences.creditNotes'} />,
    href: '/preferences/credit-notes',
  },
  {
    text: <T id={'currencies'} />,
    href: '/preferences/currencies',
  },
  {
    text: <T id={'branches.label'} />,
    href: '/preferences/branches',
  },
  {
    text: <T id={'warehouses.label'} />,
    href: '/preferences/warehouses',
  },
  {
    text: <T id={'accountant'} />,
    disabled: false,
    href: '/preferences/accountant',
  },
  {
    text: <T id={'items'} />,
    disabled: false,
    href: '/preferences/items',
  },
  {
    text: <T id={'sms_integration.label'} />,
    disabled: false,
    href: '/preferences/sms-message',
  },
];

export default preferencesMenu;
