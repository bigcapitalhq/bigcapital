// @ts-nocheck
import React from 'react';
import {
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
} from '@/components';
import withSettings from '@/containers/Settings/withSettings';
import { withBankingActions } from '../../withBankingActions';

import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { usePendingTransactionsContext } from './PendingTransactionsTableBoot';
import { usePendingTransactionsTableColumns } from './_hooks';

import { BankAccountDataTable } from '../components/BankAccountDataTable';
import { compose } from '@/utils';

/**
 * Account transactions data table.
 */
function PendingTransactionsDataTableRoot({
  // #withSettings
  cashflowTansactionsTableSize,
}) {
  // Retrieve table columns.
  const columns = usePendingTransactionsTableColumns();
  const { scrollableRef } = useAccountTransactionsContext();

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

export const PendingTransactionsDataTable = compose(
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
  withBankingActions,
)(PendingTransactionsDataTableRoot);
