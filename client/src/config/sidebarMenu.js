import React from 'react';
import { FormattedMessage as T } from 'react-intl';

export default [
  {
    divider: true,
  },
  {
    text: <T id={'homepage'} />,
    disabled: false,
    href: '/homepage',
  },
  {
    divider: true,
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
        text: <T id={'new_item'} />,
        href: '/items/new',
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
        href: '/estimates/new',
      },
      {
        text: <T id={'invocies'} />,
        href: '/invoices/new',
      },
      {
        text: <T id={'receipts'} />,
        href: '/receipts/new',
      },
    ],
  },
  {
    text: <T id={'purchases'} />,
    children: [
      {
        icon: 'cut',
        text: 'cut',
        label: '⌘C',
        disabled: false,
      },
    ],
  },
  {
    text: <T id={'contacts'} />,
    children: [
      {
        text: <T id={'customers'} />,
        href: '/customers',
      },
      {
        text: <T id={'new_customers'} />,
        href: '/customers/new',
      },
    ],
  },
  {
    divider: true,
  },
  {
    text: <T id={'financial_accounting'} />,
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
        href: '/ExchangeRates',
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
        href: '/expenses-list',
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
        text: 'Receivable Aging Summary',
        href: '/financial-reports/receivable-aging-summary',
      },
      {
        text: 'Payable Aging Summary',
        href: '/financial-reports/payable-aging-summary',
      },
    ],
  },
  {
    divider: true,
  },
  {
    text: <T id={'preferences'} />,
    href: '/preferences',
  },
  {
    text: <T id={'auditing_system'} />,
    href: '/auditing/list',
  },
];
