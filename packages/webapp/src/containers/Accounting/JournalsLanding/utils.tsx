import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { NoteAccessor, StatusAccessor } from './components';
import type { ManualJournalTableRow } from './components';
import type { DataTableColumn } from '@/components/Datatable/types';
import { FormatDateCell } from '@/components';
import { CLASSES } from '@/constants/classes';

/**
 * Retrieve the manual journals columns.
 */
export const useManualJournalsColumns =
  (): DataTableColumn<ManualJournalTableRow>[] => {
    return React.useMemo(
      () =>
        [
          {
            id: 'date',
            Header: intl.get('date'),
            accessor: 'formattedDate',
            width: 115,
            className: 'date',
            clickable: true,
          },
          {
            id: 'amount',
            Header: intl.get('amount'),
            accessor: 'formattedAmount',
            width: 115,
            clickable: true,
            money: true,
            align: 'right',
            className: clsx(CLASSES.FONT_BOLD),
          },
          {
            id: 'journal_number',
            Header: intl.get('journal_no'),
            accessor: (row: ManualJournalTableRow) => `${row.journalNumber}`,
            className: 'journal_number',
            width: 100,
            clickable: true,
            textOverview: true,
          },
          {
            id: 'journal_type',
            Header: intl.get('journal_type'),
            accessor: 'journalType',
            width: 110,
            clickable: true,
            textOverview: true,
          },
          {
            id: 'status',
            Header: intl.get('publish'),
            accessor: (row: ManualJournalTableRow) => StatusAccessor(row),
            width: 95,
            clickable: true,
          },
          {
            id: 'note',
            Header: intl.get('note'),
            accessor: NoteAccessor,
            disableSortBy: true,
            width: 85,
            clickable: true,
          },
          {
            id: 'created_at',
            Header: intl.get('created_at'),
            accessor: 'formattedCreatedAt',
            width: 125,
            clickable: true,
          },
        ] as DataTableColumn<ManualJournalTableRow>[],
      [],
    );
  };
