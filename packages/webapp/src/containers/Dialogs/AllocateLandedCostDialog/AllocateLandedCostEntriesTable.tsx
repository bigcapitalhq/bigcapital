import React from 'react';
import styled from 'styled-components';
import { useAllocateLandedCostEntriesTableColumns } from './utils';
import type { AllocateLandedCostFormEntry } from './types';
import { DataTableEditable } from '@/components';
import { compose, updateTableCell } from '@/utils';

interface AllocateLandedCostEntriesTableProps {
  entries: AllocateLandedCostFormEntry[];
  onUpdateData: (entries: AllocateLandedCostFormEntry[]) => void;
}

/**
 * Allocate landed cost entries table.
 */
export function AllocateLandedCostEntriesTable({
  onUpdateData,
  entries,
}: AllocateLandedCostEntriesTableProps) {
  // Allocate landed cost entries table columns.
  const columns = useAllocateLandedCostEntriesTableColumns();

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const newRows = (
        compose(updateTableCell(rowIndex, columnId, value)) as (
          old: AllocateLandedCostFormEntry[],
        ) => AllocateLandedCostFormEntry[]
      )(entries);
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
