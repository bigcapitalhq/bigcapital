

export default [
  {
    divider: true,
  },
  {
    icon: 'homepage',
    iconSize: 20,
    text: 'Items List',
    disabled: false,
    href: '/dashboard/items/list',
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
    icon: 'balance-scale',
    iconSize: 20,
    text: 'Financial',
    href: '/dashboard/accounts',
    children: [
      {
        text: 'cut',
        label: '⌘C',
        disabled: false,
      },

      {
        text: 'cut',
        label: '⌘C',
        disabled: false,
      },
      {
        text: 'cut',
        label: '⌘C',
        disabled: false,
      },

      {
        text: 'cut',
        label: '⌘C',
        disabled: false,
      },
    ]
  },
  {
    icon: 'university',
    iconSize: 20,
    text: 'Banking',
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
    icon: 'shopping-cart',
    iconSize: 20,
    text: 'Sales',
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
        icon: 'cut',
        text: 'cut',
        label: '⌘C',
        disabled: false,
      }
    ]
  },
  {
    text: 'Expenses',
    href: '/dashboard/expenses',
  },
  {
    text: 'New Expenses',
    href: '/dashboard/expenses/new',
  },
  {
    text: 'Make Journal',
    href: '/dashboard/accounting/make-journal-entry'
  },
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