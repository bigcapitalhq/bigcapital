// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { TABLES } from 'common/tables';
import { useMemorizedColumnsWidths } from 'hooks';
import { usePurchasesColumns, ActionMenu } from './components';
import withSettings from '../../../../Settings/withSettings';

import { compose } from 'utils';

const Purchases = [
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
 * Purchases DataTable.
 * @returns
 */
function PurchasesTable({
  // #withSettings
  purchasesTableSize,
}) {
  // Retrieve purchases table columns.
  const columns = usePurchasesColumns();

  // Handle delete purchase.
  const handleDeletePurchase = () => {};

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.PURCHASES);

  return (
    <DataTable
      columns={columns}
      data={Purchases}
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
      size={purchasesTableSize}
      payload={{
        onDelete: handleDeletePurchase,
      }}
    />
  );
}
export default compose(
  withSettings(({ purchasesSettings }) => ({
    purchasesTableSize: purchasesSettings?.tableSize,
  })),
)(PurchasesTable);
