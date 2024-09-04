// @ts-nocheck
import React from 'react';
import { Intent } from '@blueprintjs/core';
import * as R from 'ramda';
import {
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
  AppToaster,
} from '@/components';
import { TABLES } from '@/constants/tables';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useExcludedTransactionsColumns } from './_utils';
import { useExcludedTransactionsBoot } from './ExcludedTransactionsTableBoot';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { useUnexcludeUncategorizedTransaction } from '@/hooks/query/bank-rules';

import { ActionsMenu } from './_components';
import { BankAccountDataTable } from '../components/BankAccountDataTable';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../../withBankingActions';

interface ExcludeTransactionsTableProps extends WithBankingActionsProps {}

/**
 * Renders the recognized account transactions datatable.
 */
function ExcludedTransactionsTableRoot({
  // #withBankingActions
  setExcludedTransactionsSelected,
}: ExcludeTransactionsTableProps) {
  const {
    excludedBankTransactions,
    isExcludedTransactionsLoading,
    isExcludedTransactionsFetching,
  } = useExcludedTransactionsBoot();
  const { mutateAsync: unexcludeBankTransaction } =
    useUnexcludeUncategorizedTransaction();

  const { scrollableRef } = useAccountTransactionsContext();

  // Retrieve table columns.
  const columns = useExcludedTransactionsColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.UNCATEGORIZED_ACCOUNT_TRANSACTIONS);

  // Handle cell click.
  const handleCellClick = (cell, event) => {};

  // Handle restore button click.
  const handleRestoreClick = (transaction) => {
    unexcludeBankTransaction(transaction.id)
      .then(() => {
        AppToaster.show({
          message: 'The excluded bank transaction has been restored.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  // Handle selected rows change.
  const handleSelectedRowsChange = (selected) => {
    const _selectedIds = selected?.map((row) => row.original.id);
    setExcludedTransactionsSelected(_selectedIds);
  };

  return (
    <BankAccountDataTable
      noInitialFetch={true}
      columns={columns}
      data={excludedBankTransactions}
      sticky={true}
      loading={isExcludedTransactionsLoading}
      headerLoading={isExcludedTransactionsLoading}
      progressBarLoading={isExcludedTransactionsFetching}
      expandColumnSpace={1}
      expandToggleColumn={2}
      selectionColumnWidth={45}
      TableCellRenderer={TableFastCell}
      TableLoadingRenderer={TableSkeletonRows}
      TableRowsRenderer={TableVirtualizedListRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      onCellClick={handleCellClick}
      // #TableVirtualizedListRows props.
      vListrowHeight={'small' == 'small' ? 32 : 40}
      vListrowHeight={40}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      noResults={'There is no excluded bank transactions.'}
      className="table-constrant"
      selectionColumn={true}
      onSelectedRowsChange={handleSelectedRowsChange}
      windowScrollerProps={{ scrollElement: scrollableRef }}
      payload={{
        onRestore: handleRestoreClick,
      }}
    />
  );
}

export const ExcludedTransactionsTable = R.compose(withBankingActions)(
  ExcludedTransactionsTableRoot,
);
