import React from 'react';

import { CommercialDocEntriesTable } from 'components';

import { useInvoiceReadonlyEntriesColumns } from './utils';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import { TableStyle } from '../../../common';

/**
 * Invoice readonly details entries table columns.
 */
export default function InvoiceDetailTable() {
  const columns = useInvoiceReadonlyEntriesColumns();

  // Invoice details drawer context.
  const {
    invoice: { entries },
  } = useInvoiceDetailDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
    />
  );
}