import { Intent } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { withBankingActions } from '../withBankingActions';
import { useAccountTransactionsAllContext } from './AccountTransactionsAllBoot';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { useAccountTransactionsColumns, ActionsMenu } from './components';
import { handleCashFlowTransactionType } from './utils';
import type { AccountTransactionRow } from './components';
import type { WithBankingActionsProps } from '../withBankingActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
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
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useUncategorizeTransaction } from '@/hooks/query';
import { useUnmatchMatchedUncategorizedTransaction } from '@/hooks/query/banking';
import { compose } from '@/utils';

interface AccountTransactionsDataTableProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDrawerActionsProps, 'openDrawer'>,
    Pick<WithBankingActionsProps, 'setCategorizedTransactionsSelected'> {}

/**
 * Account transactions data table.
 */
function AccountTransactionsDataTableInner({
  // #withDrawerActions
  openDrawer,

  // #withBankingActions
  setCategorizedTransactionsSelected,
}: AccountTransactionsDataTableProps) {
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

  const { scrollableRef, cashflowTransactionsSettings } =
    useAccountTransactionsContext();
  const cashflowTansactionsTableSize =
    cashflowTransactionsSettings?.tableSize as string | undefined;

  // Handle view details action.
  const handleViewDetailCashflowTransaction = (
    referenceType: AccountTransactionRow,
  ) => {
    handleCashFlowTransactionType(referenceType, openDrawer);
  };
  // Handle cell click.
  const handleCellClick = (cell: {
    row: { original: AccountTransactionRow };
  }) => {
    const referenceType = cell.row.original;
    handleCashFlowTransactionType(referenceType, openDrawer);
  };
  // Handles the unmatching the matched transaction.
  const handleUnmatchTransaction = (transaction: AccountTransactionRow) => {
    unmatchTransaction({ id: transaction.uncategorizedTransactionId })
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
  const handleUncategorizeTransaction = (
    transaction: AccountTransactionRow,
  ) => {
    uncategorizeTransaction(transaction.uncategorizedTransactionId)
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
  const handleSelectedRowsChange = React.useCallback(
    (selected: Array<{ original: AccountTransactionRow }>) => {
      const selectedIds = selected
        ?.filter((row) => row.original.uncategorizedTransactionId)
        ?.map((row) => row.original.uncategorizedTransactionId);

      setCategorizedTransactionsSelected(selectedIds);
    },
    [setCategorizedTransactionsSelected],
  );

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
      vListrowHeight={32}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      selectionColumn={true}
      onSelectedRowsChange={handleSelectedRowsChange}
      noResults={<T id={'cash_flow.account_transactions.no_results'} />}
      className="table-constrant"
      windowScrollerProps={{ scrollElement: scrollableRef }}
      payload={{
        onViewDetails: handleViewDetailCashflowTransaction,
        onUncategorize: handleUncategorizeTransaction,
        onUnmatch: handleUnmatchTransaction,
      }}
    />
  );
}

export const AccountTransactionsDataTable = compose(
  withAlertActions,
  withDrawerActions,
  withBankingActions,
)(AccountTransactionsDataTableInner);

const DashboardConstrantTable = styled(DataTable)`
  .table {
    .thead {
      .th {
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
  --table-cell-border-color: #e6e6e6;

  .bp4-dark & {
    --table-cell-border-color: rgba(255, 255, 255, 0.15);
  }

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
        border-left: 1px solid var(--table-cell-border-color);
      }
    }
  }
`;
