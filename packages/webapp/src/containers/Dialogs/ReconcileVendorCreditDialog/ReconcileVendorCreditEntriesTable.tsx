import { defaultTo } from 'lodash';
import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import {
  maxAmountCreditFromRemaining,
  useReconcileVendorCreditTableColumns,
} from './utils';
import type { ReconcileVendorCreditFormEntry } from './types';
// FIXME: cross-dialog coupling — this util lives in the credit-note sibling.
// Should be extracted to a shared module; left as-is for the TS slice.
import { DataTableEditable } from '@/components';
import { maxCreditNoteAmountEntries } from '@/containers/Dialogs/ReconcileCreditNoteDialog/utils';
import { useDeepCompareEffect } from '@/hooks/utils';
import { compose, updateTableCell } from '@/utils';

interface ReconcileVendorCreditEntriesTableProps {
  onUpdateData: (entries: ReconcileVendorCreditFormEntry[]) => void;
  entries: ReconcileVendorCreditFormEntry[];
  errors?: unknown;
}

/**
 * Reconcile vendor credit entries table.
 */
export function ReconcileVendorCreditEntriesTable({
  onUpdateData,
  entries,
  errors,
}: ReconcileVendorCreditEntriesTableProps): React.ReactElement {
  // Reconcile vendor credit table columns.
  const columns = useReconcileVendorCreditTableColumns();

  // Reconcile vendor credit context.
  const { vendorCredit } = useReconcileVendorCreditContext();
  const creditsRemaining = vendorCredit?.creditsRemaining;

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      ) as ReconcileVendorCreditFormEntry[];
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  // Watches deeply entries to compose a new entries.
  useDeepCompareEffect(() => {
    const newEntries = R.compose(
      maxCreditNoteAmountEntries(defaultTo(creditsRemaining, 0)),
      maxAmountCreditFromRemaining,
    )(entries) as unknown as ReconcileVendorCreditFormEntry[];

    onUpdateData(newEntries);
  }, [entries]);

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
