import { omit } from 'lodash';
import { transfromToSnakeCase, flatObject } from 'utils';
import intl from 'react-intl-universal';

export const displayColumnsByOptions = [
  { key: 'total', name: 'Total', type: 'total', by: '' },
  { key: 'year', name: 'Date/Year', type: 'date_periods', by: 'year' },
  { key: 'month', name: 'Date/Month', type: 'date_periods', by: 'month' },
  { key: 'week', name: 'Date/Week', type: 'date_periods', by: 'month' },
  { key: 'day', name: 'Date/Day', type: 'date_periods', by: 'day' },
  { key: 'quarter', name: 'Date/Quarter', type: 'date_periods', by: 'quarter' },
];

export const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export const filterAccountsOptions = [
  {
    key: 'all-accounts',
    name: intl.get('all_accounts'),
    hint: intl.get('all_accounts_including_with_zero_balance'),
  },
  {
    key: 'without-zero-balance',
    name: intl.get('accounts_without_zero_balance'),
    hint: intl.get('include_accounts_and_exclude_zero_balance'),
  },
  {
    key: 'with-transactions',
    name: intl.get('accounts_with_transactions'),
    hint: intl.get('include_accounts_once_has_transactions_on_given_date_period'),
  },
];

export const transformDisplayColumnsType = (form) => {
  const columnType = displayColumnsByOptions.find(
    (o) => o.key === form.displayColumnsType,
  );
  return {
    displayColumnsBy: columnType ? columnType.by : '',
    displayColumnsType: columnType ? columnType.type : 'total',
  };
};

export const transformFilterFormToQuery = (form) => {
  const transformed = transfromToSnakeCase({
    ...omit(form, ['accountsFilter']),
    ...transformDisplayColumnsType(form),
    noneZero: form.accountsFilter === 'without-zero-balance',
    noneTransactions: form.accountsFilter === 'with-transactions',
  });
  return flatObject(transformed);
};
