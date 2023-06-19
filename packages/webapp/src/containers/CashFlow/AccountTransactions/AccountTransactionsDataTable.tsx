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
} from '@/components';
import { TABLES } from '@/constants/tables';

import withSettings from '@/containers/Settings/withSettings';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useAccountTransactionsColumns, ActionsMenu } from './components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
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
}) {
  // Retrieve table columns.
  const columns = useAccountTransactionsColumns();

  // Retrieve list context.
  const { cashflowTransactions, isCashFlowTransactionsLoading } =
    useAccountTransactionsContext();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CASHFLOW_Transactions);

  // handle delete transaction
  const handleDeleteTransaction = ({ reference_id }) => {
    openAlert('account-transaction-delete', { referenceId: reference_id });
  };

  const handleViewDetailCashflowTransaction = (referenceType) => {
    handleCashFlowTransactionType(referenceType, openDrawer);
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    const referenceType = cell.row.original;
    handleCashFlowTransactionType(referenceType, openDrawer);
  };

  return (
    <CashflowTransactionsTable
      noInitialFetch={true}
      columns={columns}
      data={cashflowTransactions}
      sticky={true}
      loading={isCashFlowTransactionsLoading}
      headerLoading={isCashFlowTransactionsLoading}
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
      noResults={<T id={'cash_flow.account_transactions.no_results'} />}
      className="table-constraint"
      payload={{
        onViewDetails: handleViewDetailCashflowTransaction,
        onDelete: handleDeleteTransaction,
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
)(AccountTransactionsDataTable);

const DashboardConstraintTable = styled(DataTable)`
  .table {
    .thead {
      .th {
        background: #fff;
      }
    }

    .tbody {
      .tr:last-child .td {
        border-bottom: 0;
      }
    }
  }
`;

const CashflowTransactionsTable = styled(DashboardConstraintTable)`
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
