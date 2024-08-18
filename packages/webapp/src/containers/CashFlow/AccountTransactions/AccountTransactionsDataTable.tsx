// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';

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
import { withBankingActions } from '../withBankingActions';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useAccountTransactionsColumns, ActionsMenu } from './components';
import { useAccountTransactionsAllContext } from './AccountTransactionsAllBoot';
import { useUnmatchMatchedUncategorizedTransaction } from '@/hooks/query/bank-rules';
import { useUncategorizeTransaction } from '@/hooks/query';
import { handleCashFlowTransactionType } from './utils';

import { compose } from '@/utils';

/**
 * Account transactions data table.
 */
function AccountTransactionsDataTable({
  // #withSettings
  cashflowTansactionsTableSize,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withBankingActions
  setCategorizedTransactionsSelected,
}) {
  // Retrieve table columns.
  const columns = useAccountTransactionsColumns();

  // Retrieve list context.
  const {
    cashflowTransactions,
    isCashFlowTransactionsLoading,
    isCashFlowTransactionsFetching,
  } = useAccountTransactionsAllContext();

  const { mutateAsync: uncategorizeTransaction } = useUncategorizeTransaction();
  const { mutateAsync: unmatchTransaction } =
    useUnmatchMatchedUncategorizedTransaction();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CASHFLOW_Transactions);

  // Handle view details action.
  const handleViewDetailCashflowTransaction = (referenceType) => {
    handleCashFlowTransactionType(referenceType, openDrawer);
  };
  // Handle cell click.
  const handleCellClick = (cell, event) => {
    const referenceType = cell.row.original;
    handleCashFlowTransactionType(referenceType, openDrawer);
  };
  // Handles the unmatching the matched transaction.
  const handleUnmatchTransaction = (transaction) => {
    unmatchTransaction({ id: transaction.uncategorized_transaction_id })
      .then(() => {
        AppToaster.show({
          message: 'The bank transaction has been unmatched.',
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
  // Handle uncategorize transaction.
  const handleUncategorizeTransaction = (transaction) => {
    uncategorizeTransaction(transaction.uncategorized_transaction_id)
      .then(() => {
        AppToaster.show({
          message: 'The bank transaction has been uncategorized.',
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
  const handleSelectedRowsChange = (selected) => {
    const selectedIds = selected
      ?.filter((row) => row.original.uncategorized_transaction_id)
      ?.map((row) => row.original.uncategorized_transaction_id);

    setCategorizedTransactionsSelected(selectedIds);
  };

  return (
    <CashflowTransactionsTable
      noInitialFetch={true}
      columns={columns}
      data={cashflowTransactions}
      sticky={true}
      loading={isCashFlowTransactionsLoading}
      headerLoading={isCashFlowTransactionsLoading}
      progressBarLoading={isCashFlowTransactionsFetching}
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
      vListrowHeight={cashflowTansactionsTableSize == 'small' ? 32 : 40}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      selectionColumn={true}
      onSelectedRowsChange={handleSelectedRowsChange}
      noResults={<T id={'cash_flow.account_transactions.no_results'} />}
      className="table-constrant"
      payload={{
        onViewDetails: handleViewDetailCashflowTransaction,
        onUncategorize: handleUncategorizeTransaction,
        onUnmatch: handleUnmatchTransaction,
      }}
    />
  );
}

export default compose(
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
  withAlertsActions,
  withDrawerActions,
  withBankingActions,
)(AccountTransactionsDataTable);

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
      .tr .td:not(:first-child) {
        border-left: 1px solid #e6e6e6;
      }
    }
  }
`;
