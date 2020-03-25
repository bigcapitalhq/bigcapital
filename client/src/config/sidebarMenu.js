

export default [
  {
    divider: true,
  },
  {
    icon: 'homepage',
    iconSize: 20,
    text: 'Homepage',
    disabled: false,
    href: '/dashboard/homepage',
  },
  {
    divider: true,
  },
  {
    icon: 'homepage',
    iconSize: 20,
    text: 'Items',
    children: [
      {
        text: 'Items List',
        href: '/dashboard/accounts',
      },
      {
        text: 'New Item',
        href: '/dashboard/accounts',
      },
    ]
  },
  {
    divider: true,
  },
  {
    icon: 'balance-scale',
    iconSize: 20,
    text: 'Financial',
    href: '/dashboard/accounts',
    children: [
      {
        text: 'Accounts Chart',
        href: '/dashboard/accounts',
      },
      {
        text: 'Make Journal',
        href: '/dashboard/accounting/make-journal-entry'
      },
    ]
  },
  {
    icon: 'university',
    iconSize: 20,
    text: 'Banking',
    href: '/dashboard/accounts',
    children: [
      
    ]
  },
  {
    icon: 'shopping-cart',
    iconSize: 20,
    text: 'Sales',
    href: '/dashboard/accounts',
    children: [
     
    ]
  },
  {
    icon: 'balance-scale',
    iconSize: 20,
    text: 'Purchases',
    href: '/dashboard/accounts',
    children: [
      {
        icon: 'cut',
        text: 'cut',
        label: '⌘C',
        disabled: false,
      }
    ]
  },
  {
    icon: 'analytics',
    iconSize: 18,
    text: 'Financial Reports',
    href: '/dashboard/accounts',
    children: [
      {
        text: 'Balance Sheet',
        href: '/dashboard/accounting/balance-sheet',
      },
      {
        text: 'Trial Balance Sheet',
        href: '/dashboard/accounting/trial-balance-sheet',
      },
      {
        text: 'Journal',
        href: '/dashboard/accounting/journal-sheet',
      },
      {
        text: 'General Ledger',
        href: '/dashboard/accounting/general-ledger',
      },
      {
        text: 'Profit Loss Sheet',
        href: '/dashboard/accounting/profit-loss-sheet',
      },
    ]
  },
  {
    text: 'Expenses',
    icon: 'receipt',
    iconSize: 18,
    children: [
      {
        text: 'Expenses List',
        href: '/dashboard/expenses',
      },
      {
        text: 'New Expenses',
        href: '/dashboard/expenses/new',
      },
    ]
  },
  {
    divider: true,
  },
  {
    text: 'Preferences',
    href: '/dashboard/preferences',
  },
  {
    text: 'Auditing System',
    href: '/dashboard/accounts',
  },
]