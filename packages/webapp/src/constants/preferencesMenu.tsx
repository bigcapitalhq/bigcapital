// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';

export default [
  {
    text: <T id={'general'} />,
    disabled: false,
    href: '/preferences/general',
  },
  {
    text: 'Branding',
    disabled: false,
    href: '/preferences/branding',
  },
  {
    text: 'Billing',
    href: '/preferences/billing',
  },
  {
    text: <T id={'users'} />,
    href: '/preferences/users',
  },
  {
    text: 'Payment Methods',
    href: '/preferences/payment-methods'
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
    text: 'Integrations',
    disabled: false,
    href: '/preferences/integrations'
  },
  // {
  //   text: <T id={'sms_integration.label'} />,
  //   disabled: false,
  //   href: '/preferences/sms-message',
  // },
];
