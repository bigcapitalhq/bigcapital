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

import { Can, Icon, FormattedMessage as T } from 'components';
import {
  AbilitySubject,
  Invoice_Abilities,
  Estimate_Abilities,
  Receipt_Abilities,
  Payment_Receive_Abilities,
  Customer_Abilities,
} from '../../../common/abilityOption';
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
              <Can I={Invoice_Abilities.Create} a={AbilitySubject.Invoice}>
                <MenuItem
                  text={<T id={'customer.drawer.action.new_invoice'} />}
                  onClick={handleNewInvoiceClick}
                />
              </Can>
              <Can I={Estimate_Abilities.Create} a={AbilitySubject.Estimate}>
                <MenuItem
                  text={<T id={'customer.drawer.action.new_estimate'} />}
                  onClick={handleNewEstimateClick}
                />
              </Can>
              <Can I={Receipt_Abilities.Create} a={AbilitySubject.Receipt}>
                <MenuItem
                  text={<T id={'customer.drawer.action.new_receipt'} />}
                  onClick={handleNewReceiptClick}
                />
              </Can>

              <Can
                I={Payment_Receive_Abilities.Create}
                a={AbilitySubject.PaymentReceive}
              >
                <MenuItem
                  text={<T id={'customer.drawer.action.new_payment'} />}
                  onClick={handleNewPaymentClick}
                />
              </Can>
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
        <Can I={Customer_Abilities.Edit} a={AbilitySubject.Customer}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={intl.get('customer.drawer.action.edit')}
            onClick={handleEditContact}
          />
          <NavbarDivider />
        </Can>
        <Can I={Customer_Abilities.Delete} a={AbilitySubject.Customer}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteCustomer}
          />
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDrawerActions,
  withAlertsActions,
)(CustomerDetailsActionsBar);
