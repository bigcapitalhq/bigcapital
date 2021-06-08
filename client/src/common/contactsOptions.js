import React from 'react';
import { formatMessage } from 'services/intl';

export default [
  { name: formatMessage({ id: 'customer' }), path: 'customers' },
  { name: formatMessage({ id: 'vendor' }), path: 'vendors' },
];
