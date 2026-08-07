import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Popover,
} from '@blueprintjs/core';
import clsx from 'classnames';
import { useHistory } from 'react-router-dom';
import {
  AbilitySubject,
  SaleInvoiceAction,
  PaymentMadeAction,
  VendorAction,
} from '../../../constants/abilityOption';
import { VendorMoreMenuItem } from './utils';
import { useVendorDetailsDrawerContext } from './VendorDetailsDrawerProvider';
import {
  Can,
  Icon,
  FormattedMessage as T,
  DrawerActionsBar,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { safeCallback, compose } from '@/utils';

interface VendorDetailsActionsBarProps
  extends WithDialogActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Vendor details actions bar.
 */
function VendorDetailsActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: VendorDetailsActionsBarProps) {
  const { vendorId } = useVendorDetailsDrawerContext();
  const history = useHistory();

  // Handle edit vendor.
  const onEditContact = () => {
    history.push(`/vendors/${vendorId}/edit`);
    closeDrawer(DRAWERS.VENDOR_DETAILS);
  };

  // Handle delete vendor.
  const onDeleteContact = () => {
    openAlert(`vendor-delete`, { contactId: vendorId });
  };

  // Handles clicking on new invoice button.
  const handleNewInvoiceClick = () => {
    history.push('/bills/new');
    closeDrawer(DRAWERS.VENDOR_DETAILS);
  };

  const handleNewPaymentClick = () => {
    history.push('/payments-made/new');
    closeDrawer(DRAWERS.VENDOR_DETAILS);
  };

  const handleEditOpeningBalance = () => {
    openDialog('vendor-opening-balance', { vendorId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Popover
          content={
            <Menu>
              <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
                <MenuItem
                  text={<T id={'vendor.drawer.action.new_invoice'} />}
                  onClick={handleNewInvoiceClick}
                />
              </Can>
              <Can I={PaymentMadeAction.Create} a={AbilitySubject.PaymentMade}>
                <MenuItem
                  text={<T id={'vendor.drawer.action.new_payment'} />}
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
            text={<T id={'vendor.drawer.action.new_transaction'} />}
            icon={<Icon icon={'plus'} />}
          />
        </Popover>
        <Can I={VendorAction.Edit} a={AbilitySubject.Vendor}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'vendor.drawer.action.edit'} />}
            onClick={safeCallback(onEditContact)}
          />
        </Can>
        <Can I={VendorAction.Delete} a={AbilitySubject.Vendor}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'vendor.drawer.action.delete'} />}
            intent={Intent.DANGER}
            onClick={safeCallback(onDeleteContact)}
          />
        </Can>
        <NavbarDivider />
        <VendorMoreMenuItem
          payload={{
            onEditOpeningBalance: handleEditOpeningBalance,
          }}
        />
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const VendorDetailsActionsBar = compose(
  withDrawerActions,
  withAlertActions,
  withDialogActions,
)(VendorDetailsActionsBarInner);
