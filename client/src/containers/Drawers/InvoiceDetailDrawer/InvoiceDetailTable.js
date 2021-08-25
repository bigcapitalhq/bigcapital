import React from 'react';
import clsx from 'classnames';

import { DataTable } from 'components';

import { useInvoiceReadonlyEntriesColumns } from './utils';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import InvoiceDrawerCls from 'style/components/Drawers/InvoiceDrawer.module.scss';

/**
 * Invoice readonly details entries table columns.
 */
export default function InvoiceDetailTable() {
  const columns = useInvoiceReadonlyEntriesColumns();

  const {
    invoice: { entries },
  } = useInvoiceDetailDrawerContext();

  return (
    <div className={clsx(InvoiceDrawerCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}
