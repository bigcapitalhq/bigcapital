// @ts-nocheck
import { Group, Icon } from '@/components';
import { getColumnWidth } from '@/utils';
import React from 'react';
import { useRecognizedTransactionsBoot } from './RecognizedTransactionsTableBoot';

const getReportColWidth = (data, accessor, headerText) => {
  return getColumnWidth(
    data,
    accessor,
    { magicSpacing: 10, minWidth: 100 },
    headerText,
  );
};

const recognizeAccessor = (transaction) => {
  return (
    <>
      <span>{transaction.assigned_category_formatted}</span>
      <Icon
        icon={'arrowRight'}
        color={'#8F99A8'}
        iconSize={12}
        style={{ marginLeft: 8, marginRight: 8 }}
      />
      <span>{transaction.assigned_account_name}</span>
    </>
  );
};

const descriptionAccessor = (transaction) => {
  return <span style={{ color: '#5F6B7C' }}>{transaction.description}</span>;
};

/**
 * Retrieve uncategorized transactions columns table.
 */
export function useUncategorizedTransactionsColumns() {
  const { recognizedTransactions: data } = useRecognizedTransactionsBoot();

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
        textOverview: true,
      },
      {
        Header: 'Description',
        accessor: descriptionAccessor,
        textOverview: true,
      },
      {
        Header: 'Payee',
        accessor: 'payee',
        textOverview: true,
      },
      {
        Header: 'Recognize',
        accessor: recognizeAccessor,
        textOverview: true,
      },
      {
        Header: 'Rule',
        accessor: 'bank_rule_name',
        textOverview: true,
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
