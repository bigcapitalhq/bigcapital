import { defaultTo } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import {
  maxAmountCreditFromRemaining,
  maxCreditNoteAmountEntries,
  useReconcileCreditNoteTableColumns,
} from './utils';
import type { ReconcileCreditNoteFormEntry } from './types';
import { DataTableEditable } from '@/components';
import { useDeepCompareEffect } from '@/hooks/utils';
import { compose, updateTableCell } from '@/utils';

interface ReconcileCreditNoteEntriesTableProps {
  onUpdateData: (entries: ReconcileCreditNoteFormEntry[]) => void;
  entries: ReconcileCreditNoteFormEntry[];
  errors?: unknown;
}

/**
 * Reconcile credit note entries table.
 */
export function ReconcileCreditNoteEntriesTable({
  onUpdateData,
  entries,
  errors,
}: ReconcileCreditNoteEntriesTableProps): React.ReactElement {
  // Retrieve the reconcile credit note table columns.
  const columns = useReconcileCreditNoteTableColumns();

  // Reconcile credit note context provider.
  const { creditNote } = useReconcileCreditNoteContext();
  const creditsRemaining = creditNote?.creditsRemaining;

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      ) as ReconcileCreditNoteFormEntry[];
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );
  // Deep compare entries to modify new entries.
  useDeepCompareEffect(() => {
    const newRows = compose(
      maxCreditNoteAmountEntries(defaultTo(creditsRemaining, 0)),
      maxAmountCreditFromRemaining,
    )(entries) as ReconcileCreditNoteFormEntry[];

    onUpdateData(newRows);
  }, [entries]);

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
