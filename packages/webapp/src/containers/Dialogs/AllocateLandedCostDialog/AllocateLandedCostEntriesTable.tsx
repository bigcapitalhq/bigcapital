// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { DataTableEditable } from '@/components';

import { compose, updateTableCell } from '@/utils';
import { useAllocateLandedCostEntriesTableColumns } from './utils';

/**
 * Allocate landed cost entries table.
 */
export default function AllocateLandedCostEntriesTable({
  onUpdateData,
  entries,
}) {
  // Allocate landed cost entries table columns.
  const columns = useAllocateLandedCostEntriesTableColumns();

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
    <AllocateLandedCostEntriesEditableTable
      columns={columns}
      data={entries}
      payload={{
        errors: [],
        updateData: handleUpdateData,
      }}
    />
  );
}

export const AllocateLandedCostEntriesEditableTable = styled(
  DataTableEditable,
)`
  .table {
    .thead .tr .th {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .tbody .tr .td {
      padding: 0.25rem;
    }
  }
`;
