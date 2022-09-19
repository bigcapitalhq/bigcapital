// @ts-nocheck
import intl from 'react-intl-universal';

export const filterCustomersOptions = [
  {
    key: 'all-customers',
    name: intl.get('AR_aging_summary.filter_customers.all_customers'),
    hint: intl.get('AR_aging_summary.filter_customers.all_customers.hint'),
  },
  {
    key: 'without-zero-balance',
    name: intl.get('AR_aging_summary.filter_customers.without_zero_balance'),
    hint: intl.get(
      'AR_aging_summary.filter_customers.without_zero_balance.hint',
    ),
  },
];
