// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  DataTable,
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
  FormattedMessage as T,
  AppToaster,
} from '@/components';
import { TABLES } from '@/constants/tables';

import withSettings from '@/containers/Settings/withSettings';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useUncategorizedTransactionsColumns } from './_utils';
import { useRecognizedTransactionsBoot } from './RecognizedTransactionsTableBoot';

import { ActionsMenu } from './_components';
import { compose } from '@/utils';
import { useExcludeUncategorizedTransaction } from '@/hooks/query/bank-rules';
import { Intent } from '@blueprintjs/core';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../../withBankingActions';

interface RecognizedTransactionsTableProps extends WithBankingActionsProps {}

/**
 * Renders the recognized account transactions datatable.
 */
function RecognizedTransactionsTableRoot({
  // #withSettings
  cashflowTansactionsTableSize,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withBanking
  setUncategorizedTransactionIdForMatching,
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

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    setUncategorizedTransactionIdForMatching(
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

  //
  const handleCategorizeClick = (transaction) => {
    setUncategorizedTransactionIdForMatching(
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
      noResults={<T id={'cash_flow.account_transactions.no_results'} />}
      className="table-constrant"
      payload={{
        onExclude: handleExcludeClick,
        onCategorize: handleCategorizeClick,
      }}
    />
  );
}

export const RecognizedTransactionsTable = compose(
  withAlertsActions,
  withDrawerActions,
  withBankingActions,
)(RecognizedTransactionsTableRoot);

const DashboardConstrantTable = styled(DataTable)`
  .table {
    .thead {
      .th {
        background: #fff;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 500;
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
