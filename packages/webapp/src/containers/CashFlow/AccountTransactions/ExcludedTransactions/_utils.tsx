// @ts-nocheck
import React from 'react';
import { getColumnWidth } from '@/utils';
import { useExcludedTransactionsBoot } from './ExcludedTransactionsTableBoot';

const getReportColWidth = (data, accessor, headerText) => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 10, minWidth: 100 },
    headerText,
  );
};

const descriptionAccessor = (transaction) => {
  return <span style={{ color: '#5F6B7C' }}>{transaction.description}</span>;
};

/**
 * Retrieve excluded transactions columns table.
 */
export function useExcludedTransactionsColumns() {
  const { excludedBankTransactions: data } = useExcludedTransactionsBoot();

  const withdrawalWidth = getReportColWidth(
    data,
    'formatted_withdrawal_amount',
    'Withdrawal',
  );
  const depositWidth = getReportColWidth(
    data,
    'formatted_deposit_amount',
    'Deposit',
  );

  return React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'formatted_date',
        width: 110,
      },
      {
        Header: 'Description',
        accessor: descriptionAccessor,
      },
      {
        Header: 'Payee',
        accessor: 'payee',
      },
      {
        Header: 'Deposit',
        accessor: 'formatted_deposit_amount',
        align: 'right',
        width: depositWidth,
      },
      {
        Header: 'Withdrawal',
        accessor: 'formatted_withdrawal_amount',
        align: 'right',
        width: withdrawalWidth,
      },
    ],
    [],
  );
}
