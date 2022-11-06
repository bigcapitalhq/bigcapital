// @ts-nocheck
import React from 'react';

import { TABLES } from '@/constants/tables';
import {
  DataTable,
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';

import withSettings from '@/containers/Settings/withSettings';

import { useMemorizedColumnsWidths } from '@/hooks';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';
import { useCashFlowAccountsTableColumns } from './components';
import { compose } from '@/utils';

/**
 * Cash flow accounts data table.
 */
function CashFlowAccountsDataTable({
  // #withSettings
  cashflowTableSize,
}) {
  // Retrieve list context.
  const {
    cashflowAccounts,
    isCashFlowAccountsFetching,
    isCashFlowAccountsLoading,
  } = useCashFlowAccountsContext();

  // Retrieve table columns.
  const columns = useCashFlowAccountsTableColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.CASHFLOW_ACCOUNTS);

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={cashflowAccounts}
      selectionColumn={false}
      sticky={true}
      loading={isCashFlowAccountsLoading}
      headerLoading={isCashFlowAccountsLoading}
      progressBarLoading={isCashFlowAccountsFetching}
      expandColumnSpace={1}
      expandToggleColumn={2}
      selectionColumnWidth={45}
      TableCellRenderer={TableFastCell}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={cashflowTableSize}
    />
  );
}

export default compose(
  withSettings(({ cashflowSettings }) => ({
    cashflowTableSize: cashflowSettings?.tableSize,
  })),
)(CashFlowAccountsDataTable);
