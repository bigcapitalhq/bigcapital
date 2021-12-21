import React from 'react';
import styled from 'styled-components';

import { DataTableEditable } from 'components';
import { compose, updateTableCell } from 'utils';
import { useReconcileCreditNoteTableColumns } from './utils';

/**
 * Reconcile credit note entries table.
 */
export default function ReconcileCreditNoteEntriesTable({
  onUpdateData,
  entries,
  errors,
}) {
  // Retrieve the reconcile credit note table columns.
  const columns = useReconcileCreditNoteTableColumns();

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
    <ReconcileCreditNoteEditableTable
      columns={columns}
      data={entries}
      payload={{
        errors: errors || [],
        updateData: handleUpdateData,
      }}
    />
  );
}

export const ReconcileCreditNoteEditableTable = styled(DataTableEditable)`
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
