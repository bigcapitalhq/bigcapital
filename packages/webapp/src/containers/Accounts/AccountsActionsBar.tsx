import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Switch,
  Alignment,
} from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountsChartContext } from './AccountsChartProvider';
import { useBulkDeleteAccountsDialog } from './hooks/use-bulk-delete-accounts-dialog';
import { withAccounts } from './withAccounts';
import { withAccountsTableActions } from './withAccountsTableActions';
import type { WithAccountsProps } from './withAccounts';
import type { WithAccountsTableActionsProps } from './withAccountsTableActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  AdvancedFilterPopover,
  Can,
  Icon,
  FormattedMessage as T,
  DashboardActionViewsList,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';
import { AccountAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useRefreshAccounts } from '@/hooks/query/accounts';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useSaveSettings } from '@/hooks/query';
import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';
import { compose } from '@/utils';

interface AccountsActionsBarInnerProps {
  openDialog: WithDialogActionsProps['openDialog'];
  openAlert: WithAlertActionsProps['openAlert'];
  setAccountsTableState: WithAccountsTableActionsProps['setAccountsTableState'];
  accountsSelectedRows: WithAccountsProps['accountsSelectedRows'];
  accountsInactiveMode: boolean | undefined;
  accountsFilterConditions: IFilterRole[];
}

/**
 * Accounts actions bar.
 */
function AccountsActionsBarInner({
  openDialog,
  accountsSelectedRows,
  accountsInactiveMode,
  accountsFilterConditions,
  openAlert,
  setAccountsTableState,
}: AccountsActionsBarInnerProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();
  const { resourceViews, fields, accountsSettings } = useAccountsChartContext();
  const accountsTableSize = accountsSettings?.tableSize as string | undefined;

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Accounts refresh action.
  const { refresh } = useRefreshAccounts();

  // Bulk delete accounts dialog.
  const { openBulkDeleteDialog, isValidatingBulkDeleteAccounts } =
    useBulkDeleteAccountsDialog();

  // Handle bulk accounts delete.
  const handleBulkDelete = () => {
    openBulkDeleteDialog(accountsSelectedRows);
  };
  // Handle bulk accounts activate.
  const handelBulkActivate = () => {
    openAlert('accounts-bulk-activate', { accountsIds: accountsSelectedRows });
  };
  // Handle bulk accounts inactivate.
  const handelBulkInactive = () => {
    openAlert('accounts-bulk-inactivate', {
      accountsIds: accountsSelectedRows,
    });
  };
  // Handle tab changing.
  const handleTabChange = (view: { slug?: string | null } | null) => {
    setAccountsTableState({ viewSlug: view ? view.slug : null });
  };
  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setAccountsTableState({ inactiveMode: checked });
  };
  // Handle click a refresh accounts
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size: unknown) => {
    saveSettings({
      options: [{ group: 'accounts', key: 'tableSize', value: size }],
    });
  };
  // handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/accounts/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'account' });
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'Account' });
  };
  // Handle click new account.
  const onClickNewAccount = () => {
    openDialog(DialogsName.AccountForm, {});
  };

  if (!isEmpty(accountsSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="play-16" iconSize={16} />}
            text={<T id={'activate'} />}
            onClick={handelBulkActivate}
          />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pause-16" iconSize={16} />}
            text={<T id={'inactivate'} />}
            onClick={handelBulkInactive}
          />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteAccounts}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'accounts'}
          allMenuItem={true}
          allMenuItemText={<T id={'all_accounts'} />}
          views={resourceViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={AccountAction.Create} a={AbilitySubject.Account}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'new_account'} />}
            onClick={onClickNewAccount}
          />
        </Can>
        <AdvancedFilterPopover
          popoverProps={{ minimal: true }}
          advancedFilterProps={{
            conditions: accountsFilterConditions,
            defaultFieldKey: 'name',
            fields: fields,
            onFilterChange: (filterConditions: IFilterRole[]) => {
              setAccountsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={accountsFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={accountsTableSize}
          value={accountsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
        <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
          <Switch
            labelElement={<T id={'inactive'} />}
            defaultChecked={accountsInactiveMode}
            onChange={handleInactiveSwitchChange}
          />
        </Can>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const AccountsActionsBar = compose(
  withDialogActions,
  withAlertActions,
  withAccounts(({ accountsSelectedRows, accountsTableState }) => ({
    accountsSelectedRows,
    accountsInactiveMode: accountsTableState.inactiveMode,
    accountsFilterConditions: accountsTableState.filterRoles,
  })),
  withAccountsTableActions,
)(AccountsActionsBarInner);
