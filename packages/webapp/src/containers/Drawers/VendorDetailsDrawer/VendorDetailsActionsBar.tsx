// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
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

import { useVendorDetailsDrawerContext } from './VendorDetailsDrawerProvider';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import {
  Can,
  Icon,
  DashboardActionsBar,
  FormattedMessage as T,
} from '@/components';
import { VendorMoreMenuItem } from './utils';
import {
  AbilitySubject,
  SaleInvoiceAction,
  PaymentMadeAction,
  VendorAction,
} from '../../../constants/abilityOption';
import { safeCallback, compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Vendor details actions bar.
 */
function VendorDetailsActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
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
    <DashboardActionsBar>
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
    </DashboardActionsBar>
  );
}

export default compose(
  withDrawerActions,
  withAlertsActions,
  withDialogActions,
)(VendorDetailsActionsBar);
