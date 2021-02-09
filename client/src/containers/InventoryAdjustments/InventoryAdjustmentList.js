import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import InventoryAdjustmentsAlerts from './InventoryAdjustmentsAlerts';

import { InventoryAdjustmentsProvider } from './InventoryAdjustmentsProvider';
import InventoryAdjustmentTable from './InventoryAdjustmentTable';

import withInventoryAdjustments from './withInventoryAdjustments';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose, transformTableStateToQuery } from 'utils';

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentList({
  // #withDashboardActions
  changePageTitle,

  // #withInventoryAdjustments
  inventoryAdjustmentTableState,
}) {
  const { formatMessage } = useIntl();

  // Changes the dashboard title once the page mount.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'inventory_adjustment_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <InventoryAdjustmentsProvider
      query={transformTableStateToQuery(inventoryAdjustmentTableState)}
    >
      <DashboardPageContent>
        <InventoryAdjustmentTable />
        <InventoryAdjustmentsAlerts />
      </DashboardPageContent>
    </InventoryAdjustmentsProvider>
  );
}

export default compose(
  withDashboardActions,
  withInventoryAdjustments(({ inventoryAdjustmentTableState }) => ({
    inventoryAdjustmentTableState,
  })),
)(InventoryAdjustmentList);
