import React from 'react';
import Icon from 'components/Icon';
import { isEmpty } from 'lodash';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
  Switch,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { If, DashboardActionViewsList } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import FilterDropdown from 'components/FilterDropdown';

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

  // #withAlertActions
  openAlert,

  // #withAccountsTableActions
  setAccountsTableState,

  // #ownProps
  onFilterChanged,
}) {
  const { resourceViews } = useAccountsChartContext();

  const onClickNewAccount = () => {
    openDialog('account-form', {});
  };

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
  const handleTabChange = (customView) => {
    setAccountsTableState({ customViewId: customView.id || null });
  };

  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (event) => {
    const checked = event.target.checked;
    setAccountsTableState({ inactiveMode: checked });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'accounts'}
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
        <Popover
          minimal={true}
          content={''}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
          canOutsideClickClose={true}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter', {
              'has-active-filters': false,
            })}
            text={
              true ? (
                <T id={'filter'} />
              ) : (
                intl.get('count_filters_applied', { count: 0 })
              )
            }
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

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
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertActions,
  withAccounts(({ accountsSelectedRows, accountsTableState }) => ({
    accountsSelectedRows,
    accountsInactiveMode: accountsTableState.inactiveMode,
  })),
  withAccountsTableActions,
)(AccountsActionsBar);
