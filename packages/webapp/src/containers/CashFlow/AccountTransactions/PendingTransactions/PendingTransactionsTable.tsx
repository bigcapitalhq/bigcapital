import React from 'react';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { BankAccountDataTable } from '../components/BankAccountDataTable';
import { usePendingTransactionsTableColumns } from './_hooks';
import { usePendingTransactionsContext } from './PendingTransactionsTableBoot';
import {
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
} from '@/components';

/**
 * Account transactions data table.
 */
function PendingTransactionsDataTableRoot() {
  // Retrieve table columns.
  const columns = usePendingTransactionsTableColumns();
  const { scrollableRef, cashflowTransactionsSettings } =
    useAccountTransactionsContext();
  const cashflowTansactionsTableSize =
    cashflowTransactionsSettings?.tableSize as string | undefined;

  // Retrieve list context.
  const {
    pendingTransactions,
    isPendingTransactionsLoading,
    isPendingTransactionFetching,
  } = usePendingTransactionsContext();

  return (
    <BankAccountDataTable
      noInitialFetch={true}
      columns={columns}
      data={pendingTransactions || []}
      sticky={true}
      loading={isPendingTransactionsLoading}
      headerLoading={isPendingTransactionsLoading}
      progressBarLoading={isPendingTransactionFetching}
      TableCellRenderer={TableFastCell}
      TableLoadingRenderer={TableSkeletonRows}
      TableRowsRenderer={TableVirtualizedListRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      // #TableVirtualizedListRows props.
      vListrowHeight={cashflowTansactionsTableSize === 'small' ? 32 : 40}
      vListOverscanRowCount={0}
      noResults={'There is no pending transactions in the current account.'}
      windowScrollerProps={{ scrollElement: scrollableRef }}
    />
  );
}

export const PendingTransactionsDataTable = PendingTransactionsDataTableRoot;
