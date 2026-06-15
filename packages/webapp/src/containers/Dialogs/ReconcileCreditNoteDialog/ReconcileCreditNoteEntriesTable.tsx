// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { defaultTo } from 'lodash';

import { DataTableEditable } from '@/components';
import { updateTableCell } from '@/utils';
import { useDeepCompareEffect } from '@/hooks/utils';
import {
  useReconcileCreditNoteTableColumns,
  maxAmountCreditFromRemaining,
  maxCreditNoteAmountEntries,
} from './utils';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import { flow } from 'fp-ts/function';

/**
 * Reconcile credit note entries table.
 */
export function ReconcileCreditNoteEntriesTable({
  onUpdateData,
  entries,
  errors,
}) {
  // Retrieve the reconcile credit note table columns.
  const columns = useReconcileCreditNoteTableColumns();

  // Reconcile credit note context provider.
  const {
    creditNote: { credits_remaining },
  } = useReconcileCreditNoteContext();

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
  // Deep compare entries to modify new entries.
  useDeepCompareEffect(() => {
    const newRows = flow(
      maxAmountCreditFromRemaining,
      maxCreditNoteAmountEntries(defaultTo(credits_remaining, 0)),
    )(entries);

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
