import React from 'react';
import { WarehouseTransfersActionsBar } from './WarehouseTransfersActionsBar';
import { WarehouseTransfersDataTable } from './WarehouseTransfersDataTable';
import { WarehouseTransfersListDrawers } from './WarehouseTransfersListDrawers';
import { WarehouseTransfersListProvider } from './WarehouseTransfersListProvider';
import { withWarehouseTransfers } from './withWarehouseTransfers';
import { withWarehouseTransfersActions } from './withWarehouseTransfersActions';
import type { WithWarehouseTransfersActionsProps } from './withWarehouseTransfersActions';
import { DashboardPageContent } from '@/components';
import { transformTableStateToQuery, compose } from '@/utils';

interface WarehouseTransfersListInnerProps
  extends Pick<
    WithWarehouseTransfersActionsProps,
    'resetWarehouseTransferTableState'
  > {
  warehouseTransferTableState?: unknown;
  warehouseTransferTableStateChanged?: boolean;
}

function WarehouseTransfersListInner({
  // #withWarehouseTransfers
  warehouseTransferTableState,
  warehouseTransferTableStateChanged,

  // #withWarehouseTransfersActions
  resetWarehouseTransferTableState,
}: WarehouseTransfersListInnerProps) {
  // Resets the warehouse transfer table state once the page unmount.
  React.useEffect(
    () => () => {
      resetWarehouseTransferTableState();
    },
    [resetWarehouseTransferTableState],
  );

  return (
    <WarehouseTransfersListProvider
      query={transformTableStateToQuery(
        warehouseTransferTableState as Record<string, unknown>,
      )}
      tableStateChanged={!!warehouseTransferTableStateChanged}
    >
      <WarehouseTransfersActionsBar />
      <WarehouseTransfersListDrawers />

      <DashboardPageContent>
        <WarehouseTransfersDataTable />
      </DashboardPageContent>
    </WarehouseTransfersListProvider>
  );
}

export const WarehouseTransfersList = compose(
  withWarehouseTransfersActions,
  withWarehouseTransfers(
    ({ warehouseTransferTableState, warehouseTransferTableStateChanged }) => ({
      warehouseTransferTableState,
      warehouseTransferTableStateChanged,
    }),
  ),
)(WarehouseTransfersListInner);
