import { Intent, Text } from '@blueprintjs/core';
import React from 'react';
import { withBankingActions } from '../../withBankingActions';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { BankAccountDataTable } from '../components/BankAccountDataTable';
import { ActionsMenu } from './_components';
import { useUncategorizedTransactionsColumns } from './_utils';
import styles from './RecognizedTransactionsTable.module.scss';
import { useRecognizedTransactionsBoot } from './RecognizedTransactionsTableBoot';
import type { RecognizedTransactionRow } from './_utils';
import type { WithBankingActionsProps } from '../../withBankingActions';
import {
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
  AppToaster,
  Stack,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useExcludeUncategorizedTransaction } from '@/hooks/query/banking';
import { compose } from '@/utils';

interface RecognizedTransactionsTableProps
  extends Pick<
    WithBankingActionsProps,
    'setTransactionsToCategorizeSelected'
  > {}

/**
 * Renders the recognized account transactions datatable.
 */
function RecognizedTransactionsTableRoot({
  // #withBankingActions
  setTransactionsToCategorizeSelected,
}: RecognizedTransactionsTableProps) {
  const { mutateAsync: excludeBankTransaction } =
    useExcludeUncategorizedTransaction();

  const { recognizedTransactions, isRecognizedTransactionsLoading } =
    useRecognizedTransactionsBoot();

  // Retrieve table columns.
  const columns = useUncategorizedTransactionsColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.UNCATEGORIZED_ACCOUNT_TRANSACTIONS);

  const { scrollableRef } = useAccountTransactionsContext();

  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: RecognizedTransactionRow } },
    _event: React.MouseEvent,
  ) => {
    setTransactionsToCategorizeSelected([
      cell.row.original.uncategorizedTransactionId,
    ]);
  };
  // Handle exclude button click.
  const handleExcludeClick = (transaction: RecognizedTransactionRow) => {
    excludeBankTransaction(transaction.uncategorizedTransactionId)
      .then(() => {
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The bank transaction has been excluded.',
        });
      })
      .catch(() => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };

  // Handles categorize button click.
  const handleCategorizeClick = (transaction: RecognizedTransactionRow) => {
    setTransactionsToCategorizeSelected([
      transaction.uncategorizedTransactionId,
    ]);
  };

  return (
    <BankAccountDataTable
      noInitialFetch={true}
      columns={columns}
      data={recognizedTransactions}
      sticky={true}
      loading={isRecognizedTransactionsLoading}
      headerLoading={isRecognizedTransactionsLoading}
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
      vListrowHeight={40}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      windowScrollerProps={{ scrollElement: scrollableRef }}
      noResults={<RecognizedTransactionsTableNoResults />}
      payload={{
        onExclude: handleExcludeClick,
        onCategorize: handleCategorizeClick,
      }}
    />
  );
}

export const RecognizedTransactionsTable = compose(withBankingActions)(
  RecognizedTransactionsTableRoot,
);

function RecognizedTransactionsTableNoResults() {
  return (
    <Stack spacing={12} className={styles.emptyState}>
      <Text>
        There are no Recognized transactions due to one of the following
        reasons:
      </Text>

      <ul>
        <li>
          Transaction Rules have not yet been created. Transactions are
          recognized based on the rule criteria.
        </li>

        <li>
          The transactions in your bank do not satisfy the criteria in any of
          your transaction rule(s).
        </li>
      </ul>
    </Stack>
  );
}
