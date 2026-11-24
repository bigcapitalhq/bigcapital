import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { NoteAccessor, StatusAccessor } from './components';
import type { ManualJournalTableRow } from './components';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { CLASSES } from '@/constants/classes';

const column = createColumnHelper<BP_TableFeatures, ManualJournalTableRow>();

export function useManualJournalsColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('formattedDate', {
          id: 'date',
          header: intl.get('date'),
          size: 115,
        }),
        column.accessor('formattedAmount', {
          id: 'amount',
          header: intl.get('amount'),
          size: 115,
          meta: {
            textAlign: 'right',
            bodyCellClassName: clsx('numeric-cell', CLASSES.FONT_BOLD),
          },
        }),
        column.accessor('journalNumber', {
          id: 'journal_number',
          header: intl.get('journal_no'),
          size: 100,
        }),
        column.accessor('journalType', {
          id: 'journal_type',
          header: intl.get('journal_type'),
          size: 110,
        }),
        column.accessor('isPublished', {
          id: 'status',
          header: intl.get('publish'),
          size: 95,
          cell: ({ row }) => StatusAccessor(row.original),
        }),
        column.accessor('description', {
          id: 'note',
          header: intl.get('note'),
          size: 85,
          cell: ({ row }) => NoteAccessor(row.original),
          enableSorting: false,
        }),
        column.accessor('formattedCreatedAt', {
          id: 'created_at',
          header: intl.get('created_at'),
          size: 125,
        }),
      ]),
    [],
  );
}
