import { Intent } from '@blueprintjs/core';
import React from 'react';
import { withBankingActions } from '../../withBankingActions';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { BankAccountDataTable } from '../components/BankAccountDataTable';
import { ActionsMenu } from './_components';
import { useExcludedTransactionsColumns } from './_utils';
import { useExcludedTransactionsBoot } from './ExcludedTransactionsTableBoot';
import type { ExcludedTransactionRow } from './_utils';
import type { WithBankingActionsProps } from '../../withBankingActions';
import {
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
  AppToaster,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useUnexcludeUncategorizedTransaction } from '@/hooks/query/banking';
import { compose } from '@/utils';

interface ExcludeTransactionsTableProps
  extends Pick<WithBankingActionsProps, 'setExcludedTransactionsSelected'> {}

/**
 * Renders the excluded account transactions datatable.
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
  const handleCellClick = (
    _cell: { row: { original: ExcludedTransactionRow } },
    _event: React.MouseEvent,
  ) => {};

  // Handle restore button click.
  const handleRestoreClick = (transaction: ExcludedTransactionRow) => {
    if (transaction.id == null) return;
    unexcludeBankTransaction(transaction.id)
      .then(() => {
        AppToaster.show({
          message: 'The excluded bank transaction has been restored.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  // Handle selected rows change.
  const handleSelectedRowsChange = (
    selected: Array<{ original: ExcludedTransactionRow }>,
  ) => {
    const selectedIds =
      selected
        ?.map((row) => row.original.id)
        .filter((id): id is number => id != null) ?? [];
    setExcludedTransactionsSelected(selectedIds);
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
      vListrowHeight={32}
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

export const ExcludedTransactionsTable = compose(withBankingActions)(
  ExcludedTransactionsTableRoot,
);
