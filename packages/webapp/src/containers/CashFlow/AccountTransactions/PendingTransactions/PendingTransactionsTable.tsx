// @ts-nocheck
import React from 'react';
import clsx from 'classnames';
import styled from 'styled-components';
import {
  DataTable,
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
} from '@/components';
import withSettings from '@/containers/Settings/withSettings';
import { withBankingActions } from '../../withBankingActions';

import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { usePendingTransactionsContext } from './PendingTransactionsTableBoot';
import { usePendingTransactionsTableColumns } from './_hooks';

import { compose } from '@/utils';

/**
 * Account transactions data table.
 */
function PendingTransactionsDataTableRoot({
  // #withSettings
  cashflowTansactionsTableSize,
}) {
  // Retrieve table columns.
  const columns = usePendingTransactionsTableColumns();
  const { scrollableRef } = useAccountTransactionsContext();

  // Retrieve list context.
  const {
    pendingTransactions,
    isPendingTransactionsLoading,
    isPendingTransactionFetching,
  } = usePendingTransactionsContext();

  return (
    <CashflowTransactionsTable
      noInitialFetch={true}
      columns={columns}
      data={pendingTransactions || []}
      sticky={true}
      loading={isPendingTransactionsLoading}
      headerLoading={isPendingTransactionsLoading}
      progressBarLoading={isPendingTransactionFetching}
      TableCellRenderer={TableFastCell}
      TableLoadingRenderer={TableSkeletonRows}
      TableRowsRenderer={TableVirtualizedListRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      // #TableVirtualizedListRows props.
      vListrowHeight={cashflowTansactionsTableSize === 'small' ? 32 : 40}
      vListOverscanRowCount={0}
      noResults={'There is no pending transactions in the current account.'}
      windowScrollerProps={{ scrollElement: scrollableRef }}
      className={clsx('table-constrant')}
    />
  );
}

export const PendingTransactionsDataTable = compose(
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
  withBankingActions,
)(PendingTransactionsDataTableRoot);

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
