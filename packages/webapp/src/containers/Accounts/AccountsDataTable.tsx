import { BP_Table as BlueprintTable } from '@bigcapitalhq/blueprintjs-react-table';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import '@bigcapitalhq/blueprintjs-react-table/styles.css';
import { useAccountsChartContext } from './AccountsChartProvider';
import { ActionsMenu } from './components';
import { stopExpanderPropagation, useAccountsTableColumns } from './utils';
import { withAccounts } from './withAccounts';
import { withAccountsTableActions } from './withAccountsTableActions';
import type { AccountTableRow } from './components';
import type { WithAccountsProps } from './withAccounts';
import type { WithAccountsTableActionsProps } from './withAccountsTableActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { BP_TableProps } from '@bigcapitalhq/blueprintjs-react-table';
import { EmptyStatus, MaterialProgressBar } from '@/components';
import {
  getDashboardTableProps,
  getRowId,
  onCellDetailClick,
  TABLE_LOADING_OPTIONS,
  useTableRowSelection,
} from '@/components/Datatable/blueprintTable';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { isSmallTableSize, TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { AccountDialogAction } from '@/containers/Dialogs/AccountDialog/utils';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';

interface AccountsDataTableProps
  extends WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps,
    WithAccountsTableActionsProps,
    Pick<WithAccountsProps, 'accountsSelectedRows'> {}

type AccountsTableProps = BP_TableProps<AccountTableRow>;

const EMPTY_ACCOUNTS: AccountTableRow[] = [];
const getSubRows = (account: AccountTableRow) => account.children;
const rowExpanderButtonProps = { onClick: stopExpanderPropagation };

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
  const data = accounts ?? EMPTY_ACCOUNTS;
  const isEmpty = !isAccountsLoading && data.length === 0;
  const isSmall = isSmallTableSize(accountsSettings?.tableSize);
  const loadingOptions = isAccountsLoading ? TABLE_LOADING_OPTIONS : undefined;

  const columns = useAccountsTableColumns();
  const [columnSizing, setColumnSizing] = useMemorizedColumnsWidths(
    TABLES.ACCOUNTS,
  );
  const tableState = { columnSizing };
  const { rowSelection, onRowSelectionChange } = useTableRowSelection(
    accountsSelectedRows,
    setAccountsSelectedRows,
  );

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
  const payload = {
    onEdit: handleEditAccount,
    onDelete: handleDeleteAccount,
    onActivate: handleActivateAccount,
    onInactivate: handleInactivateAccount,
    onNewChild: handleNewChildAccount,
    onViewDetails: handleViewDetailAccount,
  };

  const getCellProps: AccountsTableProps['getCellProps'] = ({
    row,
    column,
  }) => ({
    'data-testId': column.id === 'name' ? 'account-row' : undefined,
    'data-account-id': row.original.id,
    className: row.original.active ? undefined : 'inactive',
    onClick: onCellDetailClick(() => handleViewDetailAccount(row.original)),
  });

  const bodyContextMenuRenderer: AccountsTableProps['bodyContextMenuRenderer'] =
    (context) => {
      const row = context.getTargetRow();
      return row && <ActionsMenu account={row.original} payload={payload} />;
    };

  return (
    <>
      {isAccountsFetching && !isAccountsLoading && <MaterialProgressBar />}
      <BlueprintTable<AccountTableRow>
        data={data}
        columns={columns}
        getRowId={getRowId}
        getSubRows={getSubRows}
        autoResetExpanded={false}
        rowExpanderButtonProps={rowExpanderButtonProps}
        enableRowHeader={false}
        enableRowVirtualization
        htmlProps={{ className: isSmall ? 'table-size--small' : undefined }}
        {...getDashboardTableProps(isSmall)}
        enableSorting
        state={tableState}
        onColumnSizingChange={setColumnSizing}
        showRowSelectionCheckboxes
        enableSubRowSelection={false}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        getCellProps={getCellProps}
        enableBodyContextMenu={!isAccountsFetching}
        bodyContextMenuRenderer={bodyContextMenuRenderer}
        enableGhostCells
        loadingOptions={loadingOptions}
      />
      {isEmpty && (
        <EmptyStatus title={intl.get('there_is_no_results_in_the_table')} />
      )}
    </>
  );
}

export const AccountsDataTable = FF.pipe(
  AccountsDataTableInner,
  withAccounts(({ accountsSelectedRows }) => ({ accountsSelectedRows })),
  withAccountsTableActions,
  withDialogActions,
  withDrawerActions,
  withAlertActions,
);
