import React from 'react';
import { isEmpty } from 'lodash';

import DashboardInsider from 'components/Dashboard/DashboardInsider';

const WarehouseTransfersListContext = React.createContext();

/**
 * WarehouseTransfer data provider
 */
function WarehouseTransfersListProvider({ ...props }) {
  // Detarmines the datatable empty status.
  const isEmptyStatus = false;

  // Provider payload.
  const provider = {
    isEmptyStatus,
  };
  return (
    <DashboardInsider name={'warehouse-transfers-list'}>
      <WarehouseTransfersListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useWarehouseTranfersListContext = () =>
  React.useContext(WarehouseTransfersListContext);

export { WarehouseTransfersListProvider, useWarehouseTranfersListContext };
