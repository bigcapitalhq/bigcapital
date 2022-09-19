// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormatDateCell } from '@/components';

import '@/style/pages/JournalEntries/List.scss';

/**
 * Retrieve journal entries transactions table columns.
 */
export const useJournalEntriesTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'date',
        accessor: 'formatted_date',
        Cell: FormatDateCell,
        width: 140,
        className: 'date',
        textOverview: true,
      },
      {
        Header: intl.get('account_name'),
        accessor: 'account_name',
        width: 140,
        className: 'account_name',
        textOverview: true,
      },
      {
        Header: intl.get('contact'),
        accessor: 'contactTypeFormatted',
        width: 140,
      },
      {
        Header: intl.get('credit'),
        accessor: ({ credit }) => credit.formatted_amount,
        width: 100,
        className: 'credit',
      },
      {
        Header: intl.get('debit'),
        accessor: ({ debit }) => debit.formatted_amount,
        width: 100,
        className: 'debit',
      },
    ],
    [],
  );
};
