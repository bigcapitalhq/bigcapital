import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T, Can } from 'components';

import { compose } from 'utils';

/**
 * Vendor credit detail actions bar.
 */
function VendorCreditDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { vendorCreditId } = useVendorCreditDetailDrawerContext();

  const history = useHistory();

  // Handle edit credit note.
  const handleEditVendorCredit = () => {
    history.push(`/vendor-credits/${vendorCreditId}/edit`);
    closeDrawer('vendor-credit-detail-drawer');
  };

  const handleRefundVendorCredit = () => {
    openDialog('refund-vendor-credit', { vendorCreditId });
  };
  // Handle delete credit note.
  const handleDeleteVendorCredit = () => {
    openAlert('vendor-credit-delete', { vendorCreditId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'vendor_credits.label.edit_vendor_credit'} />}
          onClick={handleEditVendorCredit}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="quick-payment-16" iconSize={16} />}
          text={'Refund'}
          // text={<T id={'add_payment'} />}
          onClick={handleRefundVendorCredit}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteVendorCredit}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertsActions,
  withDrawerActions,
)(VendorCreditDetailActionsBar);
