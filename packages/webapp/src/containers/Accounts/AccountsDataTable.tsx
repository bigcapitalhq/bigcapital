import React, { useCallback } from 'react';
import { useAccountsChartContext } from './AccountsChartProvider';
import { ActionsMenu } from './components';
import { useAccountsTableColumns, rowClassNames } from './utils';
import { withAccounts } from './withAccounts';
import { withAccountsTableActions } from './withAccountsTableActions';
import type { AccountTableRow } from './components';
import type { WithAccountsProps } from './withAccounts';
import type { WithAccountsTableActionsProps } from './withAccountsTableActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  TableFastCell,
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
  TableVirtualizedListRows,
} from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { AccountDialogAction } from '@/containers/Dialogs/AccountDialog/utils';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface AccountsDataTableProps
  extends WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps,
    WithAccountsTableActionsProps,
    Pick<WithAccountsProps, 'accountsSelectedRows'> {}

interface ActionsMenuPayload {
  onEdit: (account: AccountTableRow) => void;
  onViewDetails: (account: AccountTableRow) => void;
  onDelete: (account: AccountTableRow) => void;
  onNewChild: (account: AccountTableRow) => void;
  onActivate: (account: AccountTableRow) => void;
  onInactivate: (account: AccountTableRow) => void;
}

/**
 * Accounts data-table.
 */
function AccountsDataTableInner({
  // #withAlertsDialog
  openAlert,

  // #withDialog
  openDialog,

  // #withDrawerActions
  openDrawer,

  // #withAccountsTableActions
  setAccountsSelectedRows,

  // #withAccounts
  accountsSelectedRows,
}: AccountsDataTableProps) {
  const { isAccountsLoading, isAccountsFetching, accounts, accountsSettings } =
    useAccountsChartContext();
  const accountsTableSize = accountsSettings?.tableSize as string | undefined;

  // Retrieve accounts table columns.
  const columns = useAccountsTableColumns();

  // Handle delete action account.
  const handleDeleteAccount = (account: AccountTableRow) => {
    openAlert('account-delete', { accountId: account.id });
  };

  // Handle activate action account.
  const handleActivateAccount = (account: AccountTableRow) => {
    openAlert('account-activate', { accountId: account.id });
  };

  // Handle inactivate action account.
  const handleInactivateAccount = (account: AccountTableRow) => {
    openAlert('account-inactivate', { accountId: account.id });
  };

  // Handle edit account action.
  const handleEditAccount = (account: AccountTableRow) => {
    openDialog(DialogsName.AccountForm, {
      action: AccountDialogAction.Edit,
      accountId: account.id,
    });
  };

  // Handle view detail account.
  const handleViewDetailAccount = ({ id }: AccountTableRow) => {
    openDrawer(DRAWERS.ACCOUNT_DETAILS, { accountId: id });
  };

  // Handle new child button click.
  const handleNewChildAccount = (account: AccountTableRow) => {
    openDialog(DialogsName.AccountForm, {
      action: AccountDialogAction.NewChild,
      parentAccountId: account.id,
      accountType: account.accountType,
    });
  };
  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: AccountTableRow } },
    _event: React.MouseEvent,
  ) => {
    openDrawer(DRAWERS.ACCOUNT_DETAILS, {
      accountId: cell.row.original.id,
    });
  };
  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.ACCOUNTS);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: AccountTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setAccountsSelectedRows(selectedIds);
    },
    [setAccountsSelectedRows],
  );

  const payload: ActionsMenuPayload = {
    onEdit: handleEditAccount,
    onDelete: handleDeleteAccount,
    onActivate: handleActivateAccount,
    onInactivate: handleInactivateAccount,
    onNewChild: handleNewChildAccount,
    onViewDetails: handleViewDetailAccount,
  };

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={accounts ?? []}
      selectionColumn={true}
      expandable={true}
      sticky={true}
      loading={isAccountsLoading}
      headerLoading={isAccountsLoading}
      progressBarLoading={isAccountsFetching}
      rowClassNames={rowClassNames}
      rowTestId={'account-row'}
      autoResetExpanded={false}
      autoResetSortBy={false}
      autoResetSelectedRows={false}
      expandColumnSpace={1}
      expandToggleColumn={2}
      selectionColumnWidth={45}
      TableCellRenderer={TableFastCell}
      TableRowsRenderer={TableVirtualizedListRows}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      // #TableVirtualizedListRows props.
      vListrowHeight={accountsTableSize === 'small' ? 40 : 42}
      vListOverscanRowCount={0}
      onCellClick={handleCellClick}
      onSelectedRowsChange={handleSelectedRowsChange}
      selectedRowsIds={accountsSelectedRows}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      size={accountsTableSize}
      payload={payload}
    />
  );
}

export const AccountsDataTable = compose(
  withAlertActions,
  withDrawerActions,
  withDialogActions,
  withAccountsTableActions,
  withAccounts(({ accountsSelectedRows }) => ({ accountsSelectedRows })),
)(AccountsDataTableInner);
