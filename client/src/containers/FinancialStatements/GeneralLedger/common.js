import intl from 'react-intl-universal';

export const filterAccountsOptions = [
  {
    key: 'all-accounts',
    name: intl.get('all_accounts'),
    hint: intl.get('all_accounts_including_with_zero_balance'),
  },
  {
    key: 'with-transactions',
    name: intl.get('accounts_with_transactions'),
    hint: intl.get('include_accounts_once_has_transactions_on_given_date_period'),
  },
];
