import React from 'react';
import { If } from 'components';

import { dynamicColumns } from './utils';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';

/**
 * Retrieve inventory item details columns.
 */
export const useInventoryItemDetailsColumns = () => {
  const {
    inventoryItemDetails: { columns, data },
  } = useInventoryItemDetailsContext();

  return React.useMemo(() => dynamicColumns(columns, data), [columns, data]);
};

/**
 * Cash inventory item details  loading bar.
 */
export function InventoryItemDetailsLoadingBar() {
  const { isInventoryItemDetailsLoading } = useInventoryItemDetailsContext();
  return (
    <If condition={isInventoryItemDetailsLoading}>
      <FinancialLoadingBar />
    </If>
  );
}
