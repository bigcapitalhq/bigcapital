import React from 'react';
import { useWarehouseTransferReadOnlyEntriesColumns } from './utils';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

export function WarehouseTransferDetailTable(): React.ReactElement {
  const columns = useWarehouseTransferReadOnlyEntriesColumns();

  const { warehouseTransfer } = useWarehouseDetailDrawerContext();
  const entries = warehouseTransfer?.entries ?? [];

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
    />
  );
}
