import React, { useMemo, useState, useCallback } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage as T } from 'react-intl';
import { If } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import FilterDropdown from 'components/FilterDropdown';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withResourceDetail from 'containers/Resources/withResourceDetails';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';

function AccountsActionsBar({
  openDialog,
  accountsViews,

  // #withResourceDetail
  resourceFields,

  // #withAccountsActions
  addAccountsTableQueries,

  selectedRows = [],
  onFilterChanged,
  onBulkDelete,
  onBulkArchive,
  onBulkActivate,
  onBulkInactive,
}) {
  const history = useHistory();
  const [filterCount, setFilterCount] = useState(0);

  const onClickNewAccount = () => {
    openDialog('account-form', {});
  };
  const onClickViewItem = (view) => {
    history.push(view ? `/accounts/${view.id}/custom_view` : '/accounts');
  };

  const viewsMenuItems = accountsViews.map((view) => {
    return <MenuItem onClick={() => onClickViewItem(view)} text={view.name} />;
  });
  const hasSelectedRows = useMemo(
    () => selectedRows.length > 0,
    [selectedRows]);

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    initialCondition: {
      fieldKey: 'name',
      compatator: 'contains',
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

  const handleBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map((r) => r.id));
  }, [onBulkDelete, selectedRows]);

  const handelBulkActivate = useCallback(() => {
    onBulkActivate && onBulkActivate(selectedRows.map((r) => r.id));
  }, [onBulkActivate, selectedRows]);

  const handelBulkInactive = useCallback(() => {
    onBulkInactive && onBulkInactive(selectedRows.map((r) => r.id));
  }, [onBulkInactive, selectedRows]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Popover
          content={<Menu>{viewsMenuItems}</Menu>}
          minimal={true}
          interactionKind={PopoverInteractionKind.HOVER}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--table-views')}
            icon={<Icon icon="table-16" iconSize={16} />}
            text={<T id={'table_views'} />}
            rightIcon={'caret-down'}
          />
        </Popover>

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
              filterCount <= 0 ? (
                <T id={'filter'} />
              ) : (
                <T id={'count_filters_applied'} values={{ count: filterCount }} />
              )
            }
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
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

const mapStateToProps = (state, props) => ({
  resourceName: 'accounts',
});

const withAccountsActionsBar = connect(mapStateToProps);

export default compose(
  withAccountsActionsBar,
  withDialogActions,
  withAccounts(({ accountsViews }) => ({
    accountsViews,
  })),
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withAccountsTableActions,
)(AccountsActionsBar);
