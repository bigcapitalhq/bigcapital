import React from 'react';

import { CommercialDocEntriesTable } from 'components';
import { TableStyle } from '../../../common';
import { useWarehouseTransferReadOnlyEntriesColumns } from './utils';

/**
 * Warehouse transfer detail table.
 * @returns {React.JSX}
 */
export default function WarehouseTransferDetailTable() {
  // Warehouse transfer entries table columns.
  const columns = useWarehouseTransferReadOnlyEntriesColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={[]}
      styleName={TableStyle.Constrant}
    />
  );
}
