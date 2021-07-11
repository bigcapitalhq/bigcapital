import intl from 'react-intl-universal';

export const getQuickNewActions = () => [
  { path: 'invoices/new', name: intl.get('sale_invoice') },
  { path: 'bills//new', name: intl.get('purchase_invoice') },
  { path: 'make-journal-entry', name: intl.get('manual_journal') },
  { path: 'expenses/new', name: intl.get('expense') },
  { path: 'customers/new', name: intl.get('customer') },
  { path: 'vendors/new', name: intl.get('vendor') },
];
