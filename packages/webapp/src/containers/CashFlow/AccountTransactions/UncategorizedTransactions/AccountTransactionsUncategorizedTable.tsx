// @ts-nocheck
import React from 'react';
import clsx from 'classnames';
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
import { ActionsMenu } from './components';

import withSettings from '@/containers/Settings/withSettings';
import { withBankingActions } from '../../withBankingActions';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useAccountUncategorizedTransactionsContext } from '../AllTransactionsUncategorizedBoot';
import { useExcludeUncategorizedTransaction } from '@/hooks/query/bank-rules';
import { useAccountUncategorizedTransactionsColumns } from './hooks';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';

import { compose } from '@/utils';
import { withBanking } from '../../withBanking';
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
    <CashflowTransactionsTable
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
      vListrowHeight={cashflowTansactionsTableSize === 'small' ? 32 : 40}
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
      className={clsx('table-constrant', styles.table, {
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
