// @ts-nocheck
import React from 'react';

import { DashboardPageContent } from '@/components';
import { WarehouseTransfersActionsBar } from './WarehouseTransfersActionsBar';
import { WarehouseTransfersDataTable } from './WarehouseTransfersDataTable';
import { withWarehouseTransfers } from './withWarehouseTransfers';
import { withWarehouseTransfersActions } from './withWarehouseTransfersActions';

import { WarehouseTransfersListProvider } from './WarehouseTransfersListProvider';
import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

function WarehouseTransfersListInner({
  // #withWarehouseTransfers
  warehouseTransferTableState,
  warehouseTransferTableStateChanged,

  // #withWarehouseTransfersActions
  resetWarehouseTransferTableState,
}) {
  // Resets the warehouse transfer table state once the page unmount.
  React.useEffect(
    () => () => {
      resetWarehouseTransferTableState();
    },
    [resetWarehouseTransferTableState],
  );

  return (
    <WarehouseTransfersListProvider
      query={transformTableStateToQuery(warehouseTransferTableState)}
      tableStateChanged={warehouseTransferTableStateChanged}
    >
      <WarehouseTransfersActionsBar />

      <DashboardPageContent>
        <WarehouseTransfersDataTable />
      </DashboardPageContent>
    </WarehouseTransfersListProvider>
  );
}

export const WarehouseTransfersList = flow(
  withWarehouseTransfers(
    ({ warehouseTransferTableState, warehouseTransferTableStateChanged }) => ({
      warehouseTransferTableState,
      warehouseTransferTableStateChanged,
    }),
  ),
  withWarehouseTransfersActions,
)(WarehouseTransfersListInner);
