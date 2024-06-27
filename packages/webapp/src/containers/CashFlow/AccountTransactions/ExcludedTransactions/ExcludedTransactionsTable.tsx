// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  DataTable,
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
  AppToaster,
} from '@/components';
import { TABLES } from '@/constants/tables';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useExcludedTransactionsColumns } from './_utils';
import { useExcludedTransactionsBoot } from './ExcludedTransactionsTableBoot';

import { compose } from '@/utils';
import { ActionsMenu } from './_components';
import { useUnexcludeUncategorizedTransaction } from '@/hooks/query/bank-rules';
import { Intent } from '@blueprintjs/core';

interface ExcludedTransactionsTableProps {}

/**
 * Renders the recognized account transactions datatable.
 */
function ExcludedTransactionsTableRoot({}: ExcludedTransactionsTableProps) {
  const { excludedBankTransactions } = useExcludedTransactionsBoot();
  const { mutateAsync: unexcludeBankTransaction } =
    useUnexcludeUncategorizedTransaction();

  // Retrieve table columns.
  const columns = useExcludedTransactionsColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.UNCATEGORIZED_ACCOUNT_TRANSACTIONS);

  // Handle cell click.
  const handleCellClick = (cell, event) => {};

  // Handle restore button click.
  const handleRestoreClick = (transaction) => {
    unexcludeBankTransaction(transaction.id)
      .then(() => {
        AppToaster.show({
          message: 'The excluded bank transaction has been restored.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        }); 
      });
  };

  return (
    <CashflowTransactionsTable
      noInitialFetch={true}
      columns={columns}
      data={excludedBankTransactions}
      sticky={true}
      loading={false}
      headerLoading={false}
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
      // noResults={<T id={'cash_flow.account_transactions.no_results'} />}
      className="table-constrant"
      payload={{
        onRestore: handleRestoreClick,
      }}
    />
  );
}

export const ExcludedTransactionsTable = compose(withDrawerActions)(
  ExcludedTransactionsTableRoot,
);

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
