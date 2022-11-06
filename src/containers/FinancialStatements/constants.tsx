// @ts-nocheck

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

export const filterItemsOptions = [
  {
    key: 'all-items',
    name: intl.get('all_items'),
    hint: intl.get('items.option_all_items.hint'),
  },
  {
    key: 'with-transactions',
    name: intl.get('items.option_with_transactions'),
    hint: intl.get('items.option_with_transactions.hint'),
  },
  {
    key: 'with-only-active',
    name: intl.get('items.option.only_active'),
  },
];

export const filterCustomersOptions = [
  {
    key: 'all-customers',
    name: intl.get('all_customers'),
    hint: intl.get('customers.option_all_customers.hint'),
  },
  {
    key: 'without-zero-balance',
    name: intl.get('customers.option_without_zero_balance'),
    hint: intl.get('customers.option_without_zero_balance.hint'),
  },
  {
    key: 'with-transactions',
    name: intl.get('customers.option_with_transactions'),
    hint: intl.get('customers.option_with_transactions.hint'),
  },
];

export const filterVendorsOptions = [
  {
    key: 'all-vendors',
    name: intl.get('all_vendors'),
    hint: intl.get('vendors.option_all_vendors.hint'),
  },
  {
    key: 'without-zero-balance',
    name: intl.get('vendors.option_without_zero_balance'),
    hint: intl.get('vendors.option_without_zero_balance.hint'),
  },
  {
    key: 'with-transactions',
    name: intl.get('vendors.option_with_transactions'),
    hint: intl.get('vendors.option_with_transactions.hint'),
  },
];

export const filterInventoryValuationOptions = [
  {
    key: 'all-items',
    name: intl.get('all_items'),
    hint: intl.get('items.option_all_items.hint'),
  },
  {
    key: 'with-transactions',
    name: intl.get('items.option_with_transactions'),
    hint: intl.get('items.option_with_transactions.hint'),
  },
  {
    key: 'without-zero-balance',
    name: intl.get('items.option_without_zero_balance'),
    hint: intl.get('items.option_without_zero_balance.hint'),
  },
  {
    key: 'with-only-active',
    name: intl.get('items.option.only_active'),
  },
]