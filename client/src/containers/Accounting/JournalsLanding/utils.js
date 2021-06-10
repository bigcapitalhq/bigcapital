import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import {
  NoteAccessor,
  StatusAccessor,
  DateAccessor,
  AmountAccessor,
} from './components';

/**
 * Retrieve the manual journals columns.
 */
export const useManualJournalsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: DateAccessor,
        width: 115,
        className: 'date',
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: AmountAccessor,
        className: 'amount',
        width: 115,
      },
      {
        id: 'journal_number',
        Header: intl.get('journal_no'),
        accessor: (row) => `#${row.journal_number}`,
        className: 'journal_number',
        width: 100,
      },
      {
        id: 'journal_type',
        Header: intl.get('journal_type'),
        accessor: 'journal_type',
        width: 110,
        className: 'journal_type',
      },
      {
        id: 'status',
        Header: intl.get('publish'),
        accessor: (row) => StatusAccessor(row),
        width: 95,
        className: 'status',
      },
      {
        id: 'note',
        Header: intl.get('note'),
        accessor: NoteAccessor,
        disableSortBy: true,
        width: 85,
        className: 'note',
      },
      {
        id: 'created_at',
        Header: intl.get('created_at'),
        accessor: (r) => moment(r.created_at).format('YYYY MMM DD'),
        width: 125,
        className: 'created_at',
      },
    ],
    [],
  );
};
