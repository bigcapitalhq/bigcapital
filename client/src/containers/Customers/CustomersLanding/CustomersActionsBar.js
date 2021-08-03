import React, { useCallback } from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Popover,
  Position,
  PopoverInteractionKind,
  Switch,
  Alignment,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { If, Icon, DashboardActionViewsList } from 'components';

import { useCustomersListContext } from './CustomersListProvider';
import { useRefreshCustomers } from 'hooks/query/customers';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Customers actions bar.
 */
function CustomerActionsBar({
  // #withCustomers
  customersSelectedRows = [],

  // #withCustomersActions
  setCustomersTableState,
  accountsInactiveMode,

  // #withAlertActions
  openAlert,
}) {
  // History context.
  const history = useHistory();

  // Customers list context.
  const { customersViews } = useCustomersListContext();

  // Customers refresh action.
  const { refresh } = useRefreshCustomers();

  const onClickNewCustomer = () => {
    history.push('/customers/new');
  };

  // Handle Customers bulk delete button click.,
  const handleBulkDelete = () => {
    openAlert('customers-bulk-delete', { customersIds: customersSelectedRows });
  };

  const handleTabChange = (viewId) => {
    setCustomersTableState({
      customViewId: viewId.id || null,
    });
  };
  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (event) => {
    const checked = event.target.checked;
    setCustomersTableState({ inactiveMode: checked });
  };

  // Handle click a refresh customers
  const handleRefreshBtnClick = () => {
    refresh();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'customers'}
          views={customersViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_customer'} />}
          onClick={onClickNewCustomer}
        />
        <NavbarDivider />
        <Popover
          // content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={`${intl.get('filter')}`}
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={customersSelectedRows.length}>
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
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
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
  withCustomersActions,
  withCustomers(({ customersSelectedRows, customersTableState }) => ({
    customersSelectedRows,
    accountsInactiveMode: customersTableState.inactiveMode,
  })),
  withAlertActions,
)(CustomerActionsBar);
