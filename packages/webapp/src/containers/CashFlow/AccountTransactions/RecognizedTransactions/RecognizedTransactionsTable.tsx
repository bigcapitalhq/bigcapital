// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Intent, Text } from '@blueprintjs/core';

import {
  DataTable,
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
  AppToaster,
  Stack,
} from '@/components';
import { TABLES } from '@/constants/tables';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useUncategorizedTransactionsColumns } from './_utils';
import { useRecognizedTransactionsBoot } from './RecognizedTransactionsTableBoot';

import { ActionsMenu } from './_components';
import { compose } from '@/utils';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { useExcludeUncategorizedTransaction } from '@/hooks/query/bank-rules';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../../withBankingActions';
import styles from './RecognizedTransactionsTable.module.scss';

interface RecognizedTransactionsTableProps extends WithBankingActionsProps {}

/**
 * Renders the recognized account transactions datatable.
 */
function RecognizedTransactionsTableRoot({
  // #withBankingActions
  setTransactionsToCategorizeSelected,
}: RecognizedTransactionsTableProps) {
  const { mutateAsync: excludeBankTransaction } =
    useExcludeUncategorizedTransaction();

  const { recognizedTransactions, isRecongizedTransactionsLoading } =
    useRecognizedTransactionsBoot();

  // Retrieve table columns.
  const columns = useUncategorizedTransactionsColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.UNCATEGORIZED_ACCOUNT_TRANSACTIONS);

  const { scrollableRef } = useAccountTransactionsContext();

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    setTransactionsToCategorizeSelected(
      cell.row.original.uncategorized_transaction_id,
    );
  };
  // Handle exclude button click.
  const handleExcludeClick = (transaction) => {
    excludeBankTransaction(transaction.uncategorized_transaction_id)
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
  const handleCategorizeClick = (transaction) => {
    setTransactionsToCategorizeSelected(
      transaction.uncategorized_transaction_id,
    );
  };

  return (
    <CashflowTransactionsTable
      noInitialFetch={true}
      columns={columns}
      data={recognizedTransactions}
      sticky={true}
      loading={isRecongizedTransactionsLoading}
      headerLoading={isRecongizedTransactionsLoading}
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
      windowScrollerProps={{ scrollElement: scrollableRef }}
      noResults={<RecognizedTransactionsTableNoResults />}
      className="table-constrant"
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

const DashboardConstrantTable = styled(DataTable)`
  .table {
    .thead {
      .th {
        background: #fff;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 13px;
      }
    }

    .tbody {
      .tr:last-child .td {
        border-bottom: 0;
      }
    }
  }
`;

const CashflowTransactionsTable = styled(DashboardConstrantTable)`
  .table .tbody {
    .tbody-inner .tr.no-results {
      .td {
        padding: 2rem 0;
        font-size: 14px;
        color: #888;
        font-weight: 400;
        border-bottom: 0;
      }
    }

    .tbody-inner {
      .tr .td {
        border-bottom: 1px solid #e6e6e6;
      }
    }
  }
`;

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
