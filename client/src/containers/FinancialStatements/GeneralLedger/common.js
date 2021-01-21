import { formatMessage } from 'services/intl';

export const filterAccountsOptions = [
  {
    key: 'all-accounts',
    name: formatMessage({ id: 'all_accounts' }),
    hint: formatMessage({ id: 'all_accounts_including_with_zero_balance' }),
  },
  {
    key: 'with-transactions',
    name: formatMessage({ id: 'accounts_with_transactions' }),
    hint: formatMessage({
      id: 'include_accounts_once_has_transactions_on_given_date_period',
    }),
  },
];
