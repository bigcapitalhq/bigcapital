import React from 'react';
import styled from 'styled-components';

import { DataTable, TableFastCell } from 'components';
import { TABLES } from 'common/tables';

import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withSettings from '../../Settings/withSettings';

import { useMemorizedColumnsWidths } from '../../../hooks';
import { useAccountTransactionsColumns } from './components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { compose } from 'utils';

/**
 * Account transactions data table.
 */
function AccountTransactionsDataTable({
  // #withSettings
  cashflowTansactionsTableSize,
}) {
  // Retrieve table columns.
  const columns = useAccountTransactionsColumns();

  // Retrieve list context.
  const {
    cashflowTransactions,
    isCashFlowTransactionsFetching,
    isCashFlowTransactionsLoading,
  } = useAccountTransactionsContext();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CASHFLOW_Transactions);

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
      // #TableVirtualizedListRows props.
      vListrowHeight={cashflowTansactionsTableSize == 'small' ? 32 : 40}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      noResults={
        'There is deposit/withdrawal transactions on the current account.'
      }
      className="table-constrant"
    />
  );
}

export default compose(
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
)(AccountTransactionsDataTable);

const DashboardConstrantTable = styled(DataTable)`
  .table .thead {
    .th {
      border-bottom-color: #666;
      border-top-color: #666;
      background: #fff;
    }
  }
`;

const CashflowTransactionsTable = styled(DashboardConstrantTable)`
  .table .tbody {
    
    .tbody-inner .tr.no-results {
      .td {
        padding: 3rem 0;
        font-size: 16px;
        color: #888;
        font-weight: 400;
        border-bottom: 0;
      }
    }
  }
`;

const DashboardRegularTable = styled(DataTable)``;
