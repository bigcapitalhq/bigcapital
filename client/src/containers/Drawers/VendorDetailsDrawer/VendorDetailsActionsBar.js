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
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { useVendorDetailsDrawerContext } from './VendorDetailsDrawerProvider';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T } from 'components';

import { safeCallback, compose } from 'utils';

/**
 * Vendor details actions bar.
 */
function VendorDetailsActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { vendor, vendorId } = useVendorDetailsDrawerContext();
  const history = useHistory();

  // Handle edit vendor.
  const onEditContact = () => {
    history.push(`/vendors/${vendorId}/edit`);
    closeDrawer('vendor-details-drawer');
  };

  // Handle delete vendor.
  const onDeleteContact = () => {
    openAlert(`'vendor-delete`, { vendorId });
    closeDrawer('vendor-details-drawer');
  };

  const handleNewInvoiceClick = () => {
    history.push('bills/new');
    closeDrawer('vendor-details-drawer');
  };

  const handleNewPaymentClick = () => {
    history.push('payment-mades/new');
    closeDrawer('vendor-details-drawer');
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'vendor.drawer.action.new_invoice'} />}
                onClick={handleNewInvoiceClick}
              />
              <MenuItem
                text={<T id={'vendor.drawer.action.new_payment'} />}
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
            text={<T id={'vendor.drawer.action.new_transaction'} />}
            icon={<Icon icon={'plus'} />}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'vendor.drawer.action.edit_vendor'} />}
          onClick={safeCallback(onEditContact)}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'vendor.drawer.action.delete'} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeleteContact)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDrawerActions,
  withAlertsActions,
)(VendorDetailsActionsBar);
