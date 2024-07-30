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
import { ActionsMenu } from './UncategorizedTransactions/components';

import withSettings from '@/containers/Settings/withSettings';
import { withBankingActions } from '../withBankingActions';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useAccountUncategorizedTransactionsColumns } from './components';
import { useAccountUncategorizedTransactionsContext } from './AllTransactionsUncategorizedBoot';
import { useExcludeUncategorizedTransaction } from '@/hooks/query/bank-rules';

import { compose } from '@/utils';

/**
 * Account transactions data table.
 */
function AccountTransactionsDataTable({
  // #withSettings
  cashflowTansactionsTableSize,

  // #withBankingActions
  setUncategorizedTransactionIdForMatching,
  setUncategorizedTransactionsSelected,
}) {
  // Retrieve table columns.
  const columns = useAccountUncategorizedTransactionsColumns();

  // Retrieve list context.
  const { uncategorizedTransactions, isUncategorizedTransactionsLoading } =
    useAccountUncategorizedTransactionsContext();

  const { mutateAsync: excludeTransaction } =
    useExcludeUncategorizedTransaction();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.UNCATEGORIZED_CASHFLOW_TRANSACTION);

  // Handle cell click.
  const handleCellClick = (cell) => {
    setUncategorizedTransactionIdForMatching(cell.row.original.id);
  };
  // Handles categorize button click.
  const handleCategorizeBtnClick = (transaction) => {
    setUncategorizedTransactionIdForMatching(transaction.id);
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
      .catch((error) => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };

  // Handle selected rows change.
  const handleSelectedRowsChange = (selected) => {
    const _selectedIds = selected?.map((row) => row.original.id);
    setUncategorizedTransactionsSelected(_selectedIds);
  };

  return (
    <CashflowTransactionsTable
      noInitialFetch={true}
      columns={columns}
      data={uncategorizedTransactions || []}
      sticky={true}
      selectionColumn={true}
      loading={isUncategorizedTransactionsLoading}
      headerLoading={isUncategorizedTransactionsLoading}
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
      vListrowHeight={cashflowTansactionsTableSize === 'small' ? 32 : 40}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      noResults={
        'There is no uncategorized transactions in the current account.'
      }
      className="table-constrant"
      onSelectedRowsChange={handleSelectedRowsChange}
      payload={{
        onExclude: handleExcludeTransaction,
        onCategorize: handleCategorizeBtnClick,
      }}
    />
  );
}

export default compose(
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
  withBankingActions,
)(AccountTransactionsDataTable);

const DashboardConstrantTable = styled(DataTable)`
  .table {
    .thead {
      .th {
        background: #fff;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 13px;i
        font-weight: 500;
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

      .td-description {
        color: #5f6b7c;
      }
    }
  }
`;
