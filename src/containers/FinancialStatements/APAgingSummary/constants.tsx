// @ts-nocheck
import intl from 'react-intl-universal';

export const filterVendorsOptions = [
  {
    key: 'all-vendors',
    name: intl.get('AP_aging_summary.filter_vendors.all_vendors'),
    hint: intl.get('AP_aging_summary.filter_vendors.all_vendors.hint'),
  },
  {
    key: 'without-zero-balance',
    name: intl.get('AP_aging_summary.filter_vendors.without_zero_balance'),
    hint: intl.get('AP_aging_summary.filter_vendors.without_zero_balance.hint'),
  },
];
