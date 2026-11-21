import React from 'react';
import { CashflowAccountMenu } from './CashflowAccountMenu';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';
import { useCashFlowAccountsTableColumns } from './components';
import type { CashflowAccountRow } from './components';
import {
  DataTable,
  TableFastCell,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { TABLES } from '@/constants/tables';
import { useMemorizedColumnsWidths } from '@/hooks';
import { useSettingCashFlow } from '@/hooks/query';

interface CashflowAccountsContextMenuProps {
  row: { original: CashflowAccountRow };
}

/**
 * Cashflow accounts table context menu.
 */
function CashflowAccountsContextMenu({
  row,
}: CashflowAccountsContextMenuProps) {
  return <CashflowAccountMenu account={row.original} />;
}

/**
 * Cash flow accounts data table.
 */
export function CashFlowAccountsDataTable() {
  // Settings hook.
  const { data: cashflowSettings } = useSettingCashFlow();
  const cashflowTableSize = cashflowSettings?.tableSize as string | undefined;

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
      data={cashflowAccounts ?? []}
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
      ContextMenu={CashflowAccountsContextMenu}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={cashflowTableSize}
    />
  );
}
