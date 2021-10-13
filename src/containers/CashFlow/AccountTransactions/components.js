import React from 'react';
import intl from 'react-intl-universal';

import { FormatDateCell } from 'components';

/**
 * Retrieve account transctions table columns.
 */
export function useAccountTransactionsColumns() {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 110,
        className: 'date',
      },
      {
        id: 'type',
        Header: intl.get('type'),
        accessor: 'type',
        className: 'type',
        width: 140,
        textOverview: true,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        // accessor:
        width: 160,
        className: 'status',
      },
      {
        id: 'deposit',
        Header: intl.get('cash_flow.label.deposit'),
        accessor: 'formattedDeposit',
        width: 110,
        className: 'deposit',
        align: 'right',
      },
      {
        id: 'withdrawal',
        Header: intl.get('cash_flow.label.withdrawal'),
        accessor: 'formattedWithdrawal',
        className: 'withdrawal',
        width: 150,
        align: 'right',
      },
      {
        id: 'running_balance',
        Header: intl.get('cash_flow.label.running_balance'),
        accessor: 'running_balance',
        className: 'running_balance',
        width: 150,
        align: 'right',
      },
    ],
    [],
  );
}
