import React from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Switch,
  Alignment,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import {
  If,
  Icon,
  Can,
  FormattedMessage as T,
  DashboardActionViewsList,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';

import { useCustomersListContext } from './CustomersListProvider';
import { useRefreshCustomers } from '@/hooks/query/customers';

import withCustomers from './withCustomers';
import withCustomersActions from './withCustomersActions';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withSettings from '@/containers/Settings/withSettings';
import { CustomerAction, AbilitySubject } from '@/common/abilityOption';

import { compose } from '@/utils';

/**
 * Customers actions bar.
 */
function CustomerActionsBar({
  // #withCustomers
  customersSelectedRows = [],
  customersFilterConditions,

  // #withCustomersActions
  setCustomersTableState,
  accountsInactiveMode,

  // #withAlertActions
  openAlert,

  // #withSettings
  customersTableSize,

  // #withSettingsActions
  addSetting,
}) {
  // History context.
  const history = useHistory();

  // Customers list context.
  const { customersViews, fields } = useCustomersListContext();

  // Customers refresh action.
  const { refresh } = useRefreshCustomers();

  const onClickNewCustomer = () => {
    history.push('/customers/new');
  };

  // Handle Customers bulk delete button click.,
  const handleBulkDelete = () => {
    openAlert('customers-bulk-delete', { customersIds: customersSelectedRows });
  };

  const handleTabChange = (view) => {
    setCustomersTableState({
      viewSlug: view ? view.slug : null,
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

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('customers', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'customers'}
          views={customersViews}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={CustomerAction.Create} a={AbilitySubject.Item}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_customer'} />}
            onClick={onClickNewCustomer}
          />
          <NavbarDivider />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: customersFilterConditions,
            defaultFieldKey: 'display_name',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setCustomersTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={customersFilterConditions.length}
          />
        </AdvancedFilterPopover>

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
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={customersTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
        <Can I={CustomerAction.Edit} a={AbilitySubject.Customer}>
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

export default compose(
  withCustomersActions,
  withSettingsActions,
  withCustomers(({ customersSelectedRows, customersTableState }) => ({
    customersSelectedRows,
    accountsInactiveMode: customersTableState.inactiveMode,
    customersFilterConditions: customersTableState.filterRoles,
  })),
  withSettings(({ customersSettings }) => ({
    customersTableSize: customersSettings?.tableSize,
  })),
  withAlertActions,
)(CustomerActionsBar);
