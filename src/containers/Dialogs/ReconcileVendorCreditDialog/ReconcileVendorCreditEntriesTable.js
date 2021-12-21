import React from 'react';
import styled from 'styled-components';

import { DataTableEditable } from 'components';
import { compose, updateTableCell } from 'utils';
import { useReconcileVendorCreditTableColumns } from './utils';

export default function ReconcileVendorCreditEntriesTable({
  onUpdateData,
  entries,
  errors,
}) {
  // Reconcile vendor credit table columns.
  const columns = useReconcileVendorCreditTableColumns();

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
    <ReconcileVendorCreditEditableTable
      columns={columns}
      data={entries}
      payload={{
        errors: errors || [],
        updateData: handleUpdateData,
      }}
    />
  );
}

export const ReconcileVendorCreditEditableTable = styled(DataTableEditable)`
  .table {
    max-height: 400px;
    overflow: auto;

    .thead .tr .th {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .tbody {
      .tr .td {
        padding: 2px 4px;
        min-height: 38px;
      }
    }
  }
`;
