import intl from 'react-intl-universal';

export const ContactsOptions: Array<{ name: string; path: string }> = [
  { name: intl.get('customer'), path: 'customers' },
  { name: intl.get('vendor'), path: 'vendors' },
];
