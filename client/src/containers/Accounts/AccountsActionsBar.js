import React, { memo, useState } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as T } from 'react-intl';
import { If, DashboardActionViewsList } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import FilterDropdown from 'components/FilterDropdown';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withResourceDetail from 'containers/Resources/withResourceDetails';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withAccounts from 'containers/Accounts/withAccounts';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Accounts actions bar.
 */
function AccountsActionsBar({
  openDialog,
  accountsViews,

  // #withResourceDetail
  resourceFields,

  // #withAccountsTableActions
  addAccountsTableQueries,
  setAccountsBulkAction,

  // #withAccounts
  accountsTableQuery,
  accountsSelectedRows,

  // #withAlertActions
  openAlert,

  onFilterChanged,
}) {
  const [filterCount, setFilterCount] = useState(
    accountsTableQuery?.filter_roles?.length || 0,
  );

  const onClickNewAccount = () => {
    openDialog('account-form', {});
  };

  // Filter dropdown.
  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    initialConditions: accountsTableQuery.filter_roles,
    initialCondition: {
      fieldKey: 'name',
      comparator: 'contains',
      value: '',
    },
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length || 0);
      addAccountsTableQueries({
        filter_roles: filterConditions || '',
      });
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  const handleBulkDelete = () => {
    openAlert('accounts-bulk-delete', { accountsIds: accountsSelectedRows });
  };

  const handelBulkActivate = () => {
    openAlert('accounts-bulk-activate', { accountsIds: accountsSelectedRows });
  };

  const handelBulkInactive = () => {
    openAlert('accounts-bulk-inactivate', { accountsIds: accountsSelectedRows });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'accounts'}
          views={accountsViews}
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
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
          canOutsideClickClose={true}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter', {
              'has-active-filters': filterCount > 0,
            })}
            text={
              (filterCount <= 0) ? (
                <T id={'filter'} />
              ) : (
                <T
                  id={'count_filters_applied'}
                  values={{ count: filterCount }}
                />
              )
            }
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={accountsSelectedRows.length}>
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
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

// Momerize the component.
const AccountsActionsBarMemo = memo(AccountsActionsBar);

const mapStateToProps = (state, props) => ({
  resourceName: 'accounts',
});

const withAccountsActionsBar = connect(mapStateToProps);

const comp = compose(
  withAccountsActionsBar,
  withDialogActions,
  withAccounts(
    ({ accountsSelectedRows, accountsViews, accountsTableQuery }) => ({
      accountsViews,
      accountsTableQuery,
      accountsSelectedRows,
    }),
  ),
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withAccountsTableActions,
  withAlertActions
)(AccountsActionsBarMemo);

export default comp;
