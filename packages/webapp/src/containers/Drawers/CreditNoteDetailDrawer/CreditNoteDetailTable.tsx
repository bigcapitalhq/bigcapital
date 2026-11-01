import React from 'react';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';
import { useCreditNoteReadOnlyEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';

/**
 * Credit note detail table.
 */
export function CreditNoteDetailTable() {
  const { creditNote } = useCreditNoteDetailDrawerContext();
  const entries = creditNote?.entries ?? [];

  // Credit note entries table columns.
  const columns = useCreditNoteReadOnlyEntriesColumns();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries.some((e) => e.discountFormatted) ? [] : ['discount']
      }
      className={'table-constrant'}
    />
  );
}
