import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Position,
  PopoverInteractionKind,
  Popover,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import clsx from 'classnames';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { useCustomerDetailsDrawerContext } from './CustomerDetailsDrawerProvider';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T } from 'components';

import { compose } from 'utils';

/**
 * Customer details actions bar.
 */
function CustomerDetailsActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { contact, customerId } = useCustomerDetailsDrawerContext();
  const history = useHistory();

  // Handle new invoice button click.
  const handleNewInvoiceClick = () => {
    history.push('invoices/new');
    closeDrawer('customer-details-drawer');
  };
  // Handle new receipt button click.
  const handleNewReceiptClick = () => {
    history.push('receipts/new');
    closeDrawer('customer-details-drawer');
  };
  // Handle new payment receive button click.
  const handleNewPaymentClick = () => {
    history.push('payment-receives/new');
    closeDrawer('customer-details-drawer');
  };
  // Handle new estimate button click.
  const handleNewEstimateClick = () => {
    history.push('estimates/new');
    closeDrawer('customer-details-drawer');
  };

  const handleDeleteCustomer = () => {
    openAlert(`customer-delete`, { contactId: customerId });
  };
  
  const handleEditContact = () => {
    history.push(`/customers/${customerId}/edit`);
    closeDrawer('customer-details-drawer');
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'customer.drawer.action.new_invoice'} />}
                onClick={handleNewInvoiceClick}
              />
              <MenuItem
                text={<T id={'customer.drawer.action.new_estimate'} />}
                onClick={handleNewEstimateClick}
              />
              <MenuItem
                text={<T id={'customer.drawer.action.new_receipt'} />}
                onClick={handleNewReceiptClick}
              />
              <MenuItem
                text={<T id={'customer.drawer.action.new_payment'} />}
                onClick={handleNewPaymentClick}
              />
            </Menu>
          }
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={clsx(Classes.MINIMAL)}
            text={<T id={'customer.drawer.action.new_transaction'} />}
            icon={<Icon icon={'plus'} />}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={intl.get('customer.drawer.action.edit')}
          onClick={handleEditContact}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteCustomer}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDrawerActions,
  withAlertsActions,
)(CustomerDetailsActionsBar);
