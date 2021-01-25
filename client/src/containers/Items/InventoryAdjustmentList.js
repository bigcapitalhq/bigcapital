import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import AppToaster from 'components/AppToaster';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import InventoryAdjustmentDataTable from './InventoryAdjustmentDataTable';
import withInventoryAdjustmentActions from './withInventoryAdjustmentActions';
import withInventoryAdjustments from './withInventoryAdjustments';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';
import { Route, Switch } from 'react-router-dom';

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentList({
  // #withDashboardActions
  changePageTitle,

  // #withInventoryAdjustments
  inventoryAdjustmentTableQuery,

  // #withInventoryAdjustmentsActions
  requestFetchInventoryAdjustmentTable,
  requestDeleteInventoryAdjustment,
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
    ['inventory-adjustment-list' ,inventoryAdjustmentTableQuery],
    (key, query) => requestFetchInventoryAdjustmentTable({ ...query }),
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

  const handleConfirmInventoryAdjustmentDelete = useCallback(() => {
    requestDeleteInventoryAdjustment(deleteInventoryAdjustment.id)
      .then(() => {
        setDeleteInventoryAdjustment(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_adjustment_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setDeleteInventoryAdjustment(false);
      });
  }, [
    deleteInventoryAdjustment,
    requestDeleteInventoryAdjustment,
    formatMessage,
  ]);

  // Calculates the data table selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  return (
    <DashboardInsider name={'inventory_adjustments'}>
      <DashboardPageContent>
        <Switch>
          <Route exact={true}>
            <InventoryAdjustmentDataTable
              onDeleteInventoryAdjustment={handleDeleteInventoryAdjustment}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon={'trash'}
          intent={Intent.DANGER}
          isOpen={deleteInventoryAdjustment}
          onCancel={handleCancelInventoryAdjustmentDelete}
          onConfirm={handleConfirmInventoryAdjustmentDelete}
        >
          <p>
            <T
              id={
                'once_delete_this_inventory_a_adjustment_you_will_able_to_restore_it'
              }
            />
          </p>
        </Alert>
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
)(InventoryAdjustmentList);
