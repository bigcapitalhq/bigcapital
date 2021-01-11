import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import InventoryAdjustmentDataTable from './InventoryAdjustmentDataTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
//withInventoryAdjustmentsActions
import { compose } from 'utils';
import { Route, Switch } from 'react-router-dom';

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentList({
  // #withDashboardActions
  changePageTitle,
  // #withInventoryAdjustmentsActions
}) {
  const { formatMessage } = useIntl();
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteInventoryAdjustment, setDeleteInventoryAdjustment] = useState(
    false,
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'inventory_adjustment_list' }));
  }, [changePageTitle, formatMessage]);

  const fetchInventoryAdjustments = useQuery(
    ['inventory-adjustment-list'],
    () => {},
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (inventory) => {
      setSelectedRows(inventory);
    },
    [setSelectedRows],
  );

  const handleDeleteInventoryAdjustment = useCallback(
    (adjustment) => {
      setDeleteInventoryAdjustment(adjustment);
    },
    [setDeleteInventoryAdjustment],
  );

  const handleCancelInventoryAdjustmentDelete = useCallback(() => {
    setDeleteInventoryAdjustment(false);
  }, [setDeleteInventoryAdjustment]);

  const handleConfirmInventoryAdjustmentDelete = useCallback(() => {}, []);

  // Calculates the data table selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  return (
    <DashboardInsider>
      <DashboardPageContent>
        <Switch>
          <Route exact={true}>
            <InventoryAdjustmentDataTable
              onDeleteInventoryAdjustment={handleDeleteInventoryAdjustment}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(withDashboardActions)(InventoryAdjustmentList);
