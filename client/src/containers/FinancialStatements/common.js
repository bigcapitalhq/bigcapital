import { omit } from 'lodash';
import { transfromToSnakeCase, flatObject } from 'utils';
import intl from 'react-intl-universal';

export const displayColumnsByOptions = [
  { key: 'total', name: intl.get('total'), type: 'total', by: '' },
  {
    key: 'year',
    name: intl.get('date_year'),
    type: 'date_periods',
    by: 'year',
  },
  {
    key: 'month',
    name: intl.get('date_month'),
    type: 'date_periods',
    by: 'month',
  },
  {
    key: 'week',
    name: intl.get('date_week'),
    type: 'date_periods',
    by: 'month',
  },
  {
    key: 'day',
    name: intl.get('date_day'),
    type: 'date_periods',
    by: 'day',
  },
  {
    key: 'quarter',
    name: intl.get('date_quarter'),
    type: 'date_periods',
    by: 'quarter',
  },
];

export const dateRangeOptions = [
  { value: 'today', label: intl.get('today') },
  { value: 'this_week', label: intl.get('this_week') },
  { value: 'this_month', label: intl.get('this_month') },
  { value: 'this_quarter', label: intl.get('this_quarter') },
  { value: 'this_year', label: intl.get('this_year') },
  { value: 'custom', label: intl.get('custom_range') },
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
    hint: intl.get(
      'include_accounts_once_has_transactions_on_given_date_period',
    ),
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
  return transformed;
};
