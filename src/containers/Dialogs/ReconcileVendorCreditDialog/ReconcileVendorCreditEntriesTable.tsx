// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { defaultTo } from 'lodash';

import { useDeepCompareEffect } from '@/hooks/utils';

import { DataTableEditable } from '@/components';
import { compose, updateTableCell } from '@/utils';
import {
  useReconcileVendorCreditTableColumns,
  maxAmountCreditFromRemaining,
} from './utils';
import { maxCreditNoteAmountEntries } from '@/containers/Dialogs/ReconcileCreditNoteDialog/utils';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';

/**
 * Reconcile vendor credit entries table.
 */
export default function ReconcileVendorCreditEntriesTable({
  onUpdateData,
  entries,
  errors,
}) {
  // Reconcile vendor credit table columns.
  const columns = useReconcileVendorCreditTableColumns();

  // Reconcile vendor credit context.
  const {
    vendorCredit: { credits_remaining },
  } = useReconcileVendorCreditContext();

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

  // Watches deeply entries to compose a new entries.
  useDeepCompareEffect(() => {
    const newEntries = R.compose(
      maxCreditNoteAmountEntries(defaultTo(credits_remaining, 0)),
      maxAmountCreditFromRemaining,
    )(entries);

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
