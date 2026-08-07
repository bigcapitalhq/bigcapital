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
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { useCustomerDetailsDrawerContext } from './CustomerDetailsDrawerProvider';
import { CustomerMoreMenuItem } from './utils';
import {
  Can,
  Icon,
  FormattedMessage as T,
  DrawerActionsBar,
} from '@/components';
import {
  AbilitySubject,
  SaleInvoiceAction,
  SaleEstimateAction,
  SaleReceiptAction,
  PaymentReceiveAction,
  CustomerAction,
} from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface CustomerDetailsActionsBarProps
  extends WithDialogActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Customer details actions bar.
 */
function CustomerDetailsActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: CustomerDetailsActionsBarProps) {
  const { customerId } = useCustomerDetailsDrawerContext();
  const history = useHistory();

  // Handle new invoice button click.
  const handleNewInvoiceClick = () => {
    history.push('/invoices/new');
    closeDrawer(DRAWERS.CUSTOMER_DETAILS);
  };
  // Handle new receipt button click.
  const handleNewReceiptClick = () => {
    history.push('/receipts/new');
    closeDrawer(DRAWERS.CUSTOMER_DETAILS);
  };
  // Handle new payment receive button click.
  const handleNewPaymentClick = () => {
    history.push('/payment-received/new');
    closeDrawer(DRAWERS.CUSTOMER_DETAILS);
  };
  // Handle new estimate button click.
  const handleNewEstimateClick = () => {
    history.push('/estimates/new');
    closeDrawer(DRAWERS.CUSTOMER_DETAILS);
  };
  // Handles delete customer click.
  const handleDeleteCustomer = () => {
    openAlert(`customer-delete`, { contactId: customerId });
  };
  // Handles edit customer click.
  const handleEditContact = () => {
    history.push(`/customers/${customerId}/edit`);
    closeDrawer(DRAWERS.CUSTOMER_DETAILS);
  };
  // Handle edit opening balance click.
  const handleEditOpeningBalance = () => {
    openDialog('customer-opening-balance', { customerId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Popover
          content={
            <Menu>
              <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
                <MenuItem
                  text={<T id={'customer.drawer.action.new_invoice'} />}
                  onClick={handleNewInvoiceClick}
                />
              </Can>
              <Can I={SaleEstimateAction.Create} a={AbilitySubject.Estimate}>
                <MenuItem
                  text={<T id={'customer.drawer.action.new_estimate'} />}
                  onClick={handleNewEstimateClick}
                />
              </Can>
              <Can I={SaleReceiptAction.Create} a={AbilitySubject.Receipt}>
                <MenuItem
                  text={<T id={'customer.drawer.action.new_receipt'} />}
                  onClick={handleNewReceiptClick}
                />
              </Can>

              <Can
                I={PaymentReceiveAction.Create}
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

        <Can I={CustomerAction.Edit} a={AbilitySubject.Customer}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={intl.get('customer.drawer.action.edit')}
            onClick={handleEditContact}
          />
        </Can>
        <Can I={CustomerAction.Delete} a={AbilitySubject.Customer}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteCustomer}
          />
        </Can>
        <NavbarDivider />
        <CustomerMoreMenuItem
          payload={{
            onEditOpeningBalance: handleEditOpeningBalance,
          }}
        />
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const CustomerDetailsActionsBar = compose(
  withDrawerActions,
  withAlertActions,
  withDialogActions,
)(CustomerDetailsActionsBarInner);
