// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { CLASSES } from '@/constants/classes';
import { FormatDateCell } from '@/components';
import { NoteAccessor, StatusAccessor } from './components';

/**
 * Retrieve the manual journals columns.
 */
export const useManualJournalsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'formatted_date',
        width: 115,
        className: 'date',
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        width: 115,
        clickable: true,
        money: true,
        align: 'right',
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'journal_number',
        Header: intl.get('journal_no'),
        accessor: (row) => `${row.journal_number}`,
        className: 'journal_number',
        width: 100,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'journal_type',
        Header: intl.get('journal_type'),
        accessor: 'journal_type',
        width: 110,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'status',
        Header: intl.get('publish'),
        accessor: (row) => StatusAccessor(row),
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
        accessor: 'formatted_created_at',
        width: 125,
        clickable: true,
      },
    ],
    [],
  );
};
