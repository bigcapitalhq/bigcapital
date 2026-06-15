// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { DataTableEditable } from '@/components';

import { updateTableCell } from '@/utils';
import { useAllocateLandedCostEntriesTableColumns } from './utils';
import { flow } from 'fp-ts/function';

/**
 * Allocate landed cost entries table.
 */
export function AllocateLandedCostEntriesTable({ onUpdateData, entries }) {
  // Allocate landed cost entries table columns.
  const columns = useAllocateLandedCostEntriesTableColumns();

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex, columnId, value) => {
      const newRows = flow(updateTableCell(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  return (
    <AllocateLandeedCostEntriesEditableTable
      columns={columns}
      data={entries}
      payload={{
        errors: [],
        updateData: handleUpdateData,
      }}
    />
  );
}

export const AllocateLandeedCostEntriesEditableTable = styled(
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
