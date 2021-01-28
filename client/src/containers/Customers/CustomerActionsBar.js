import React, { useCallback, useMemo, useState } from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Popover,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { If, Icon, DashboardActionViewsList } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withCustomers from 'containers/Customers/withCustomers';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

const CustomerActionsBar = ({
  // #withCustomers
  customersViews,
  customersSelectedRows,

  //#withCustomersActions
  addCustomersTableQueries,
  changeCustomerView,

  // #withAlertActions
  openAlert,

  // #ownProps
  onFilterChanged,
}) => {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const onClickNewCustomer = useCallback(() => {
    history.push('/customers/new');
  }, [history]);

  // Handle Customers bulk delete button click.,
  const handleBulkDelete = () => {
    openAlert('customers-bulk-delete', { customersIds: customersSelectedRows });
  };

  const handleTabChange = (viewId) => {
    changeCustomerView(viewId.id || -1);
    addCustomersTableQueries({
      custom_view_id: viewId.id || null,
    });
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
            text={`${formatMessage({ id: 'filters_applied' })}`}
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
      </NavbarGroup>
    </DashboardActionsBar>
  );
};

const mapStateToProps = (state, props) => ({
  resourceName: 'customers',
});
const withCustomersActionsBar = connect(mapStateToProps);

export default compose(
  withCustomersActionsBar,
  withCustomersActions,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withCustomers(({ customersViews, customersSelectedRows }) => ({
    customersViews,
    customersSelectedRows,
  })),
  withAlertActions,
)(CustomerActionsBar);
