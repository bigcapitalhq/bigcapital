import React from 'react';
import Icon from 'components/Icon';
import { isEmpty } from 'lodash';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Switch,
  Alignment,
} from '@blueprintjs/core';

import { FormattedMessage as T } from 'components';
import {
  AdvancedFilterPopover,
  If,
  DashboardActionViewsList,
  DashboardFilterButton,
} from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { useRefreshAccounts } from 'hooks/query/accounts';
import { useAccountsChartContext } from 'containers/Accounts/AccountsChartProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withAccounts from 'containers/Accounts/withAccounts';
import withAlertActions from 'containers/Alert/withAlertActions';
import withAccountsTableActions from './withAccountsTableActions';

import { compose } from 'utils';

/**
 * Accounts actions bar.
 */
function AccountsActionsBar({
  // #withDialogActions
  openDialog,

  // #withAccounts
  accountsSelectedRows,
  accountsInactiveMode,
  accountsFilterConditions,

  // #withAlertActions
  openAlert,

  // #withAccountsTableActions
  setAccountsTableState,

  // #ownProps
  onFilterChanged,
}) {
  const { resourceViews, fields } = useAccountsChartContext();

  const onClickNewAccount = () => {
    openDialog('account-form', {});
  };

  // Accounts refresh action.
  const { refresh } = useRefreshAccounts();

  // Handle bulk accounts delete.
  const handleBulkDelete = () => {
    openAlert('accounts-bulk-delete', { accountsIds: accountsSelectedRows });
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
  const handleTabChange = (view) => {
    setAccountsTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (event) => {
    const checked = event.target.checked;
    setAccountsTableState({ inactiveMode: checked });
  };

  // Handle click a refresh accounts
  const handleRefreshBtnClick = () => {
    refresh();
  };

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

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'new_account'} />}
          onClick={onClickNewAccount}
        />
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: accountsFilterConditions,
            defaultFieldKey: 'name',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setAccountsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={accountsFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <NavbarDivider />

        <If condition={!isEmpty(accountsSelectedRows)}>
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
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Switch
          labelElement={<T id={'inactive'} />}
          defaultChecked={accountsInactiveMode}
          onChange={handleInactiveSwitchChange}
        />
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

export default compose(
  withDialogActions,
  withAlertActions,
  withAccounts(({ accountsSelectedRows, accountsTableState }) => ({
    accountsSelectedRows,
    accountsInactiveMode: accountsTableState.inactiveMode,
    accountsFilterConditions: accountsTableState.filterRoles,
  })),
  withAccountsTableActions,
)(AccountsActionsBar);
