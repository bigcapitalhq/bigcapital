import React from 'react';
import clsx from 'classnames';

import { DataTable } from 'components';

import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import { useReceiptReadonlyEntriesTableColumns } from './utils';

import ReceiptDrawerCls from 'style/components/Drawers/ReceiptDrawer.module.scss';

/**
 * Receipt readonly details table columns.
 */
export default function ReceiptDetailTable() {
  const {
    receipt: { entries },
  } = useReceiptDetailDrawerContext();

  // Receipt readonly entries table columns.
  const columns = useReceiptReadonlyEntriesTableColumns();

  return (
    <div className={clsx(ReceiptDrawerCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}
