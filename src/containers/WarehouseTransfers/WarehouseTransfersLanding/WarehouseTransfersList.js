import React from 'react';

// style..
import { DashboardPageContent } from 'components';
import WarehouseTransfersActionsBar from './WarehouseTransfersActionsBar';

import WarehouseTransfersViewTabs from './WarehouseTransfersViewTabs';
import WarehouseTransfersDataTable from './WarehouseTransfersDataTable';

import { WarehouseTransfersListProvider } from './WarehouseTransfersListProvider';
import { compose } from 'utils';

function WarehouseTransfersList({}) {
  return (
    <WarehouseTransfersListProvider>
      <WarehouseTransfersActionsBar />
      <DashboardPageContent>
        <WarehouseTransfersViewTabs />
        <WarehouseTransfersDataTable />
      </DashboardPageContent>
    </WarehouseTransfersListProvider>
  );
}

export default WarehouseTransfersList;
