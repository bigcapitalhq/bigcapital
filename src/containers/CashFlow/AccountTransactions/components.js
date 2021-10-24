import React from 'react';
import intl from 'react-intl-universal';
import { MaterialProgressBar } from 'components';
import { FormatDateCell } from 'components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';

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
        accessor: 'reference_type_formatted',
        className: 'type',
        width: 140,
        textOverview: true,
      },
      {
        id: 'transaction_number',
        Header: intl.get('transaction_number'),
        accessor: 'transaction_number',
        width: 160,
        className: 'transaction_number',
      },
      {
        id: 'reference_number',
        Header: intl.get('reference_no'),
        accessor: 'reference_number',
        width: 160,
        className: 'reference_number',
      },
      {
        id: 'deposit',
        Header: intl.get('cash_flow.label.deposit'),
        accessor: 'formatted_deposit',
        width: 110,
        className: 'deposit',
        textOverview: true,
        align: 'right',
      },
      {
        id: 'withdrawal',
        Header: intl.get('cash_flow.label.withdrawal'),
        accessor: 'formatted_withdrawal',
        className: 'withdrawal',
        width: 150,
        textOverview: true,
        align: 'right',
      },
      {
        id: 'running_balance',
        Header: intl.get('cash_flow.label.running_balance'),
        accessor: 'running_balance',
        className: 'running_balance',
        width: 150,
        textOverview: true,
        align: 'right',
      },
    ],
    [],
  );
}

/**
 * Account transactions progress bar.
 */
export function AccountTransactionsProgressBar() {
  const { isCashFlowTransactionsFetching } = useAccountTransactionsContext();

  return isCashFlowTransactionsFetching ? <MaterialProgressBar /> : null;
}
