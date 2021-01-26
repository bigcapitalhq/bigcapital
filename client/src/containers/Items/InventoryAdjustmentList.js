import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Route, Switch } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ItemsAlerts from './ItemsAlerts';
import InventoryAdjustmentDataTable from './InventoryAdjustmentDataTable';

import withInventoryAdjustmentActions from './withInventoryAdjustmentActions';
import withInventoryAdjustments from './withInventoryAdjustments';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentList({
  // #withDashboardActions
  changePageTitle,

  // #withInventoryAdjustments
  inventoryAdjustmentTableQuery,

  // #withAlertsActions.
  openAlert,

  // #withInventoryAdjustmentsActions
  requestFetchInventoryAdjustmentTable,
  setSelectedRowsInventoryAdjustments,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'inventory_adjustment_list' }));
  }, [changePageTitle, formatMessage]);

  const fetchInventoryAdjustments = useQuery(
    ['inventory-adjustment-list', inventoryAdjustmentTableQuery],
    (key, query) => requestFetchInventoryAdjustmentTable({ ...query }),
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = (selectedRows) => {
    const selectedRowsIds = selectedRows.map((r) => r.id);
    setSelectedRowsInventoryAdjustments(selectedRowsIds);
  };

  const handleDeleteInventoryAdjustment = ({ id }) => {
    openAlert('inventory-adjustment-delete', { inventoryId: id });
  };
  return (
    <DashboardInsider name={'inventory_adjustments'}>
      <DashboardPageContent>
        <Switch>
          <Route exact={true}>
            <InventoryAdjustmentDataTable
              onDeleteInventoryAdjustment={handleDeleteInventoryAdjustment}
            />
          </Route>
        </Switch>
        <ItemsAlerts />
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withInventoryAdjustmentActions,
  withInventoryAdjustments(({ inventoryAdjustmentTableQuery }) => ({
    inventoryAdjustmentTableQuery,
  })),
  withAlertsActions,
)(InventoryAdjustmentList);
