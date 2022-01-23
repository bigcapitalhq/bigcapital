import React from 'react';

import { useWarehouseTransferTableColumns } from '../utils';
import { DataTableEditable } from 'components';
import { compose, saveInvoke, updateTableCell } from 'utils';

/**
 * Warehouse transfer form entries table.
 */
export default function WarehouseTransferFormEntriesTable({
  // #ownProps
  items,
  entries,
  onUpdateData,
  errors,
}) {
  // Retrieve the warehouse transfer table columns.
  const columns = useWarehouseTransferTableColumns();

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  return (
    <DataTableEditable
      columns={columns}
      data={entries}
      payload={{
        items,
        errors: errors || [],
        updateData: handleUpdateData,
      }}
    />
  );
}
