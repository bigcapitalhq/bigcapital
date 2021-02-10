import React from 'react';
import classNames from 'classnames';

import { TableFastCell, DataTable } from 'components';
import { compose } from 'utils';

import { CLASSES } from 'common/classes';

import { useAccountsTableColumns, rowClassNames } from './utils';
import { ActionsMenu } from './components';

import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import { useAccountsChartContext } from './AccountsChartProvider';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

/**
 * Accounts data-table.
 */
function AccountsDataTable({
  // #withAlertsDialog
  openAlert,

  // #withDial
  openDialog,
}) {
  const {
    isAccountsLoading,
    isAccountsFetching,
    accounts,
  } = useAccountsChartContext();

  // Retrieve accounts table columns.
  const columns = useAccountsTableColumns();

  // Handle delete action account.
  const handleDeleteAccount = (account) => {
    openAlert('account-delete', { accountId: account.id });
  };

  // Handle activate action account.
  const handleActivateAccount = (account) => {
    openAlert('account-activate', { accountId: account.id });
  };

  // Handle inactivate action account.
  const handleInactivateAccount = (account) => {
    openAlert('account-inactivate', { accountId: account.id });
  };

  // Handle select accounts datatable rows.
  //   const handleSelectedRowsChange = (selectedRows) => {
  //     const selectedRowsIds = selectedRows.map((r) => r.id);
  //     setSelectedRowsAccounts(selectedRowsIds);
  //   };

  // Handle edit account action.
  const handleEditAccount = (account) => {
    openDialog('account-form', { action: 'edit', id: account.id });
  };

  // Handle new child button click.
  const handleNewChildAccount = (account) => {
    openDialog('account-form', {
      action: 'new_child',
      parentAccountId: account.id,
      accountType: account.account_type,
    });
  };

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={accounts}
        selectionColumn={true}
        expandable={true}
        sticky={true}

        loading={isAccountsLoading}
        headerLoading={isAccountsLoading}
        progressBarLoading={isAccountsFetching}
        
        rowClassNames={rowClassNames}

        autoResetExpanded={false}
        autoResetSortBy={false}
        autoResetSelectedRows={false}

        expandColumnSpace={1}
        expandToggleColumn={2}
        selectionColumnWidth={50}

        TableCellRenderer={TableFastCell}
        TableRowsRenderer={TableVirtualizedListRows}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}

        // #TableVirtualizedListRows props.
        vListrowHeight={42}
        vListOverscanRowCount={10}

        payload={{
          onEdit: handleEditAccount,
          onDelete: handleDeleteAccount,
          onActivate: handleActivateAccount,
          onInactivate: handleInactivateAccount,
          newChild: handleNewChildAccount
        }}
      />
    </div>
  );
}

export default compose(withAlertsActions, withDialogActions)(AccountsDataTable);
