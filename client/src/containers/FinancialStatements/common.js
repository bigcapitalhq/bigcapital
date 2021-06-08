import { omit } from 'lodash';
import { transfromToSnakeCase, flatObject } from 'utils';
import { formatMessage } from 'services/intl';

export const displayColumnsByOptions = [
  { key: 'total', name: formatMessage({ id: 'total' }), type: 'total', by: '' },
  {
    key: 'year',
    name: formatMessage({ id: 'date_year' }),
    type: 'date_periods',
    by: 'year',
  },
  {
    key: 'month',
    name: formatMessage({ id: 'date_month' }),
    type: 'date_periods',
    by: 'month',
  },
  {
    key: 'week',
    name: formatMessage({ id: 'date_week' }),
    type: 'date_periods',
    by: 'month',
  },
  {
    key: 'day',
    name: formatMessage({ id: 'date_day' }),
    type: 'date_periods',
    by: 'day',
  },
  {
    key: 'quarter',
    name: formatMessage({ id: 'date_quarter' }),
    type: 'date_periods',
    by: 'quarter',
  },
];

export const dateRangeOptions = [
  { value: 'today', label: formatMessage({ id: 'today' }) },
  { value: 'this_week', label: formatMessage({ id: 'this_week' }) },
  { value: 'this_month', label: formatMessage({ id: 'this_month' }) },
  { value: 'this_quarter', label: formatMessage({ id: 'this_quarter' }) },
  { value: 'this_year', label: formatMessage({ id: 'this_year' }) },
  { value: 'custom', label: formatMessage({ id: 'custom_range' }) },
];

export const filterAccountsOptions = [
  {
    key: 'all-accounts',
    name: formatMessage({ id: 'all_accounts' }),
    hint: formatMessage({ id: 'all_accounts_including_with_zero_balance' }),
  },
  {
    key: 'without-zero-balance',
    name: formatMessage({ id: 'accounts_without_zero_balance' }),
    hint: formatMessage({
      id: 'include_accounts_and_exclude_zero_balance',
    }),
  },
  {
    key: 'with-transactions',
    name: formatMessage({ id: 'accounts_with_transactions' }),
    hint: formatMessage({
      id: 'include_accounts_once_has_transactions_on_given_date_period',
    }),
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
