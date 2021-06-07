import React from 'react';
import { formatMessage } from 'services/intl';

export default [
  { path: 'invoices/new', name: formatMessage({ id: 'sale_invoice' }) },
  { path: 'bills//new', name: formatMessage({ id: 'purchase_invoice' }) },
  { path: 'make-journal-entry', name: formatMessage({ id: 'manual_journal' }) },
  { path: 'expenses/new', name: formatMessage({ id: 'expense' }) },
  { path: 'customers/new', name: formatMessage({ id: 'customer' }) },
  { path: 'vendors/new', name: formatMessage({ id: 'vendor' }) },
];
