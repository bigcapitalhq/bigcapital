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
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import DialogConnect from 'connectors/Dialog.connector';
import AccountsConnect from 'connectors/Accounts.connector';
import {compose} from 'utils';
import FilterDropdown from 'components/FilterDropdown';
import ResourceConnect from 'connectors/Resource.connector';

function AccountsActionsBar({
  openDialog,
  views,
  selectedRows = [],
  getResourceFields,
  addAccountsTableQueries,
  onFilterChanged,
  onBulkDelete,
  onBulkArchive,
}) {
  const {path} = useRouteMatch();
  const onClickNewAccount = () => { openDialog('account-form', {}); };

  const accountsFields = getResourceFields('accounts');
  const [filterCount, setFilterCount] = useState(0);

  const viewsMenuItems = views.map((view) => {
    return (<MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />);
  });
  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [selectedRows]);
 
  const filterDropdown = FilterDropdown({
    fields: accountsFields,
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length || 0);
      addAccountsTableQueries({
        filter_roles: filterConditions || '',  
      });
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  const handleBulkArchive = useCallback(() => {
    onBulkArchive && onBulkArchive(selectedRows.map(r => r.id));
  }, [onBulkArchive, selectedRows]);

  const handleBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map(r => r.id));
  }, [onBulkDelete, selectedRows]);

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
            icon={<Icon icon='table' />}
            text='Table Views'
            rightIcon={'caret-down'}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text='New Account'
          onClick={onClickNewAccount}
        />
        <Popover
          minimal={true}
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}>

          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={filterCount <= 0 ? 'Filter' : `${filterCount} filters applied`}
            icon={ <Icon icon="filter" /> }/>
        </Popover>

        {hasSelectedRows && (
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon='archive' iconSize={15} />}
            text='Archive'
            onClick={handleBulkArchive}
          />
        )}
        {hasSelectedRows && (
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon='trash' iconSize={15} />}
            text='Delete'
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        )}
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text='Import'
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text='Export'
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

const mapStateToProps = state => {
  return {
    // selectedRows: state.accounts.selectedRows
  };
};

export default compose(
  DialogConnect,
  AccountsConnect,
  ResourceConnect,
  connect(mapStateToProps),
)(AccountsActionsBar);
