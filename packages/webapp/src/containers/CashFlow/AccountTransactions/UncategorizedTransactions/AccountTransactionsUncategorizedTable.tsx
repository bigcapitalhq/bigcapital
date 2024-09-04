// @ts-nocheck
import React from 'react';
import clsx from 'classnames';
import { Intent } from '@blueprintjs/core';
import {
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
  AppToaster,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { ActionsMenu } from './components';
import { BankAccountDataTable } from '../components/BankAccountDataTable';

import withSettings from '@/containers/Settings/withSettings';
import { withBankingActions } from '../../withBankingActions';
import { withBanking } from '../../withBanking';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useAccountUncategorizedTransactionsContext } from '../AllTransactionsUncategorizedBoot';
import { useExcludeUncategorizedTransaction } from '@/hooks/query/bank-rules';
import { useAccountUncategorizedTransactionsColumns } from './hooks';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';

import { compose } from '@/utils';
import styles from './AccountTransactionsUncategorizedTable.module.scss';

/**
 * Account transactions data table.
 */
function AccountTransactionsDataTable({
  // #withSettings
  cashflowTansactionsTableSize,

  // #withBanking
  openMatchingTransactionAside,
  enableMultipleCategorization,

  // #withBankingActions
  setUncategorizedTransactionIdForMatching,
  setUncategorizedTransactionsSelected,

  addTransactionsToCategorizeSelected,
  setTransactionsToCategorizeSelected,
}) {
  // Retrieve table columns.
  const columns = useAccountUncategorizedTransactionsColumns();
  const { scrollableRef } = useAccountTransactionsContext();

  // Retrieve list context.
  const {
    uncategorizedTransactions,
    isUncategorizedTransactionsLoading,
    isUncategorizedTransactionFetching,
  } = useAccountUncategorizedTransactionsContext();

  const { mutateAsync: excludeTransaction } =
    useExcludeUncategorizedTransaction();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.UNCATEGORIZED_CASHFLOW_TRANSACTION);

  // Handle cell click.
  const handleCellClick = (cell) => {
    if (enableMultipleCategorization) {
      addTransactionsToCategorizeSelected(cell.row.original.id);
    } else {
      setTransactionsToCategorizeSelected(cell.row.original.id);
    }
  };
  // Handles categorize button click.
  const handleCategorizeBtnClick = (transaction) => {
    setUncategorizedTransactionIdForMatching(transaction.id);
  };
  // handles table selected rows change.
  const handleSelectedRowsChange = (selected) => {
    const transactionIds = selected.map((r) => r.original.id);
    setUncategorizedTransactionsSelected(transactionIds);
  };
  // Handle exclude transaction.
  const handleExcludeTransaction = (transaction) => {
    excludeTransaction(transaction.id)
      .then(() => {
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The bank transaction has been excluded successfully.',
        });
      })
      .catch(() => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };

  return (
    <BankAccountDataTable
      noInitialFetch={true}
      columns={columns}
      data={uncategorizedTransactions || []}
      sticky={true}
      selectionColumn={true}
      loading={isUncategorizedTransactionsLoading}
      headerLoading={isUncategorizedTransactionsLoading}
      progressBarLoading={isUncategorizedTransactionFetching}
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
      vListrowHeight={cashflowTansactionsTableSize === 'small' ? 34 : 40}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      noResults={
        'There is no uncategorized transactions in the current account.'
      }
      payload={{
        onExclude: handleExcludeTransaction,
        onCategorize: handleCategorizeBtnClick,
      }}
      onSelectedRowsChange={handleSelectedRowsChange}
      windowScrollerProps={{ scrollElement: scrollableRef }}
      className={clsx(styles.table, {
        [styles.showCategorizeColumn]: enableMultipleCategorization,
      })}
    />
  );
}

export default compose(
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
  withBankingActions,
  withBanking(
    ({ openMatchingTransactionAside, enableMultipleCategorization }) => ({
      openMatchingTransactionAside,
      enableMultipleCategorization,
    }),
  ),
)(AccountTransactionsDataTable);
