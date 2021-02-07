  import React from 'react';
import { FormattedMessage as T } from 'react-intl';

export default [
  {
    text: <T id={'homepage'} />,
    disabled: false,
    href: '/homepage',
  },
  {
    text: 'Sales & inventory',
    label: true,
  },
  {
    text: <T id={'items'} />,
    children: [
      {
        text: <T id={'items_list'} />,
        href: '/items',
      },
      {
        text: <T id={'inventory_adjustments'} />,
        href: '/inventory-adjustments',
      },
      {
        text: <T id={'category_list'} />,
        href: '/items/categories',
      },
    ],
  },
  {
    text: <T id={'sales'} />,
    children: [
      {
        text: <T id={'estimates'} />,
        href: '/estimates',
        newTabHref: '/estimates/new',
      },
      {
        text: <T id={'invoices'} />,
        href: '/invoices',
        newTabHref: '/invoices/new',
      },

      {
        text: <T id={'payment_receives'} />,
        href: '/payment-receives',
        newTabHref: '/payment-receives/new',
      },
      {
        divider: true,
      },
      {
        text: <T id={'receipts'} />,
        href: '/receipts',
        newTabHref: '/receipts/new',
      },
    ],
  },
  {
    text: <T id={'purchases'} />,
    children: [
      {
        text: <T id={'bills'} />,
        href: '/bills',
        newTabHref: '/bills/new',
      },
      {
        text: <T id={'payment_made'} />,
        href: '/payment-mades',
        newTabHref: '/payment-mades/new',
      },
    ],
  },
  {
    text: <T id={'contacts'} />,
    children: [
      {
        text: <T id={'customers'} />,
        href: '/customers',
        newTabHref: '/customers/new',
      },
      {
        text: <T id={'vendors'} />,
        href: '/vendors',
        newTabHref: '/vendors/new',
      },
    ],
  },
  {
    text: <T id={'accounting'} />,
    label: true,
  },
  {
    text: <T id={'financial'} />,
    children: [
      {
        text: <T id={'accounts_chart'} />,
        href: '/accounts',
      },
      {
        text: <T id={'manual_journal'} />,
        href: '/manual-journals',
      },
      {
        text: <T id={'make_journal_entry'} />,
        href: '/make-journal-entry',
      },
      {
        text: <T id={'exchange_rate'} />,
        href: '/exchange-rates',
      },
    ],
  },
  {
    text: <T id={'banking'} />,
    children: [],
  },
  {
    text: <T id={'expenses'} />,
    children: [
      {
        text: <T id={'expenses'} />,
        href: '/expenses',
      },
      {
        text: <T id={'new_expense'} />,
        href: '/expenses/new',
      },
    ],
  },
  {
    text: <T id={'financial_reports'} />,
    children: [
      {
        text: <T id={'all_reports'} />,
        href: '/financial-reports',
        matchExact: true,
      },
      {
        divider: true,
      },
      {
        text: <T id={'balance_sheet'} />,
        href: '/financial-reports/balance-sheet',
      },
      {
        text: <T id={'trial_balance_sheet'} />,
        href: '/financial-reports/trial-balance-sheet',
      },
      {
        text: <T id={'journal'} />,
        href: '/financial-reports/journal-sheet',
      },
      {
        text: <T id={'general_ledger'} />,
        href: '/financial-reports/general-ledger',
      },
      {
        text: <T id={'profit_loss_sheet'} />,
        href: '/financial-reports/profit-loss-sheet',
      },
      {
        text: 'A/R Aging Summary',
        href: '/financial-reports/receivable-aging-summary',
      },
      {
        text: 'A/P Aging Summary',
        href: '/financial-reports/payable-aging-summary',
      },
    ],
  },
  {
    text: <T id={'system'} />,
    label: true,
  },
  {
    text: <T id={'preferences'} />,
    href: '/preferences',
  },
  {
    text: <T id={'billing'} />,
    href: '/billing',
  },
  {
    text: <T id={'auditing_system'} />,
    href: '/auditing/list',
  },
];
