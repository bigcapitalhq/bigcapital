//@ts-nocheck
import React from 'react';
import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { TABLES } from 'common/tables';
import { useMemorizedColumnsWidths } from 'hooks';
import { useSalesColumns, ActionMenu } from './components';
import withSettings from '../../../../Settings/withSettings';

import { compose } from 'utils';

const Sales = [
  {
    id: 1,
    date: '2022-06-08T22:00:00.000Z',
    type: 'Invoice',
    transaction_no: 'Inv-12345',
    due_date: '2022-06-08T22:00:00.000Z',
    balance: '$100.00',
    status: 'Paid',
    total: '$100.00',
  },
];

/**
 * Sales DataTable.
 * @returns
 */
function SalesTable({
  // #withSettings
  salesTableSize,
}) {
  // Retrieve sales table columns.
  const columns = useSalesColumns();

  // Handle delete sale.
  const handleDeleteSale = () => {};

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.SALES);

  return (
    <DataTable
      columns={columns}
      data={Sales}
      // loading={}
      // headerLoading={}
      // progressBarLoading={}
      manualSortBy={true}
      selectionColumn={true}
      noInitialFetch={true}
      sticky={true}
      ContextMenu={ActionMenu}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={salesTableSize}
      payload={{
        onDelete: handleDeleteSale,
      }}
    />
  );
}
export default compose(
  withSettings(({ salesSettings }) => ({
    salesTableSize: salesSettings?.tableSize,
  })),
)(SalesTable);
