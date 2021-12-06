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

import { If, Icon, FormattedMessage as T, Can } from 'components';

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
  const { vendorCreditId, vendorCredit } = useVendorCreditDetailDrawerContext();

  const history = useHistory();

  // Handle edit credit note.
  const handleEditVendorCredit = () => {
    history.push(`/vendor-credits/${vendorCreditId}/edit`);
    closeDrawer('vendor-credit-detail-drawer');
  };

  // Handle delete credit note.
  const handleDeleteVendorCredit = () => {
    openAlert('vendor-credit-delete', { vendorCreditId });
  };

  const handleRefundVendorCredit = () => {
    openDialog('refund-vendor-credit', { vendorCreditId });
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
        <If condition={!vendorCredit.is_closed && !vendorCredit.is_draft}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="quick-payment-16" iconSize={16} />}
            text={<T id={'refund'} />}
            onClick={handleRefundVendorCredit}
          />
          <NavbarDivider />
        </If>
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
