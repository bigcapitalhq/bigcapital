import React from 'react';
import clsx from 'classnames';

import { DataTable } from 'components';

import { useBillDrawerContext } from './BillDrawerProvider';
import { useBillReadonlyEntriesTableColumns } from './utils';

import BillDrawerCls from 'style/components/Drawers/BillDrawer.module.scss';

export default function BillDetailTable() {
  const { bill: { entries } } = useBillDrawerContext();

  // Retrieve bill readonly entries table columns.
  const columns = useBillReadonlyEntriesTableColumns();

  return (
    <div className={clsx(BillDrawerCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}
