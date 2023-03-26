// @ts-nocheck
import intl from 'react-intl-universal';
import React from 'react';

import { FormatNumberCell } from '@/components';

/**
 * Retrieve cashflow transaction entries columns.
 */
export const useCashflowTransactionColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('account_name'),
        accessor: 'account.name',
        width: 130,
        disableSortBy: true,
        className: 'account',
      },
      {
        Header: intl.get('contact'),
        accessor: 'contact.display_name',
        width: 130,
        disableSortBy: true,
        className: 'contact',
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        Cell: FormatNumberCell,
        width: 100,
        disableResizable: true,
        disableSortBy: true,
        formatNumber: { noZero: true },
        className: 'credit',
        align: 'right',
      },
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        Cell: FormatNumberCell,
        width: 100,
        disableResizable: true,
        disableSortBy: true,
        formatNumber: { noZero: true },
        className: 'debit',
        align: 'right',
      },
    ],
    [],
  );
