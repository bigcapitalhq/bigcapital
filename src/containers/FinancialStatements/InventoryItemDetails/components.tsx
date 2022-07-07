import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If, FormattedMessage as T } from '@/components';

import { dynamicColumns } from './utils';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';

/**
 * Retrieve inventory item details columns.
 */
export const useInventoryItemDetailsColumns = () => {
  const {
    inventoryItemDetails: { columns, tableRows },
  } = useInventoryItemDetailsContext();

  return React.useMemo(
    () => dynamicColumns(columns, tableRows),
    [columns, tableRows],
  );
};

/**
 * inventory item details  loading bar.
 */
export function InventoryItemDetailsLoadingBar() {
  const { isInventoryItemDetailsFetching } = useInventoryItemDetailsContext();

  return (
    <If condition={isInventoryItemDetailsFetching}>
      <FinancialLoadingBar />
    </If>
  );
}

/**
 * inventory item details alerts
 */
export function InventoryItemDetailsAlerts() {
  const {
    inventoryItemDetails,
    isInventoryItemDetailsLoading,
    inventoryItemDetailsRefetch,
  } = useInventoryItemDetailsContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    inventoryItemDetailsRefetch();
  };

  // Can't display any error if the report is loading
  if (isInventoryItemDetailsLoading) {
    return null;
  }

  return (
    <If condition={inventoryItemDetails.meta.is_cost_compute_running}>
      <div className="alert-compute-running">
        <Icon icon="info-block" iconSize={12} />
        <T id={'just_a_moment_we_re_calculating_your_cost_transactions'} />

        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          <T id={'refresh'} />
        </Button>
      </div>
    </If>
  );
}
