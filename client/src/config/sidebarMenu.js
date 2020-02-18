

export default [
  {
    divider: true,
  },
  {
    icon: 'cut',
    text: 'Homepage',
    disabled: false,
    href: '/dashboard/homepage',
  },
  {
    divider: true,
  },
  {
    icon: 'cut',
    text: 'Chart of Accounts',
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
]