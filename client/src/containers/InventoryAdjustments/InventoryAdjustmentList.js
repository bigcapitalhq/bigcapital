import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import InventoryAdjustmentsAlerts from './InventoryAdjustmentsAlerts';

import { InventoryAdjustmentsProvider } from './InventoryAdjustmentsProvider';
import InventoryAdjustmentView from './InventoryAdjustmentView';

import withInventoryAdjustments from './withInventoryAdjustments';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Inventory Adjustment List.
 */
function InventoryAdjustmentList({
  // #withDashboardActions
  changePageTitle,

  // #withInventoryAdjustments
  inventoryAdjustmentTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'inventory_adjustment_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <InventoryAdjustmentsProvider query={inventoryAdjustmentTableQuery}>
      <DashboardPageContent>
        <InventoryAdjustmentView />
        <InventoryAdjustmentsAlerts />
      </DashboardPageContent>
    </InventoryAdjustmentsProvider>
  );
}

export default compose(
  withDashboardActions,
  withInventoryAdjustments(({ inventoryAdjustmentTableQuery }) => ({
    inventoryAdjustmentTableQuery,
  })),
)(InventoryAdjustmentList);
