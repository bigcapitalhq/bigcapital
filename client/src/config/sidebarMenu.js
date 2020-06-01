import React  from 'react'
import { FormattedMessage as T} from 'react-intl';

export default [
  {
    divider: true,
  },
  {
    icon: 'homepage',
    iconSize: 20,
    text: <T id={'homepage'}/>,
    disabled: false,
   href: '/homepage',
  },
  {
    divider: true,
  },
  {
    icon: 'homepage',
    iconSize: 20,
    text: <T id={'items'}/>,
    children: [
      {
        text: <T id={'items_list'}/>,
        href: '/items',
      },
      {
        text: <T id={'new_item'}/>,
        href: '/items/new',
      },
      {
        text: <T id={'category_list'}/>,
        href: '/items/categories',
      },
    ],
  },
  {
    spacer: true,
  },
  {
    icon: 'balance-scale',
    iconSize: 20,
    text: <T id={'financial'}/>,
    children: [
      {
        text: <T id={'accounts_chart'}/>,
        href: '/accounts',
      },
      {
        text: <T id={'manual_journal'}/>,
        href: '/manual-journals',
      },
      {
        text: <T id={'make_journal'}/>,
        href: '/make-journal-entry',
      },
      {
        text: <T id={'exchange_rate'}/>,
        href: '/ExchangeRates',
      },
    ],
  },
  {
    icon: 'university',
    iconSize: 20,
    text: <T id={'banking'}/>,
    children: [],
  },
  {
    icon: 'shopping-cart',
    iconSize: 20,
    text: <T id={'sales'}/>,
    children: [],
  },
  {
    icon: 'balance-scale',
    iconSize: 20,
    text: <T id={'purchases'}/>,
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
    icon: 'analytics',
    iconSize: 18,
    text: <T id={'financial_reports'}/>,
    children: [
      {
        text: <T id={'balance_sheet'}/>,
        href: '/balance-sheet',
      },
      {
        text: <T id={'trial_balance_sheet'}/>,
        href: '/trial-balance-sheet',
      },
      {
        text: <T id={'journal'}/>,
        href: '/journal-sheet',
      },
      {
        text: <T id={'general_ledger'}/>,
        href: '/general-ledger',
      },
      {
        text: <T id={'profit_loss_sheet'}/>,
        href: '/profit-loss-sheet',
      },
    ],
  },
  {
    text: <T id={'expenses'}/>,
    icon: 'receipt',
    iconSize: 18,
    children: [
      {
        text: <T id={'expenses'}/>,
        href: '/expenses',
      },
      {
        text: <T id={'new_expenses'}/>,
        href: '/expenses/new',
      },
    ],
  },
  {
    divider: true,
  },
  {
    text: <T id={'preferences'}/>,
    href: '/preferences',
  },
  {
    text: <T id={'auditing_system'}/>,
    href: '/auditing/list',
  },
];
