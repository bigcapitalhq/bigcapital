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

import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T } from 'components';

import { compose } from 'utils';

/**
 * Payment receive actions bar.
 */
function PaymentReceiveActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Retrieve the payment receive drawer context.
  const { paymentReceiveId } = usePaymentReceiveDetailContext();

  // Handle edit payment receive.
  const handleEditPaymentReceive = () => {
    history.push(`/payment-receives/${paymentReceiveId}/edit`);
    closeDrawer('payment-receive-detail-drawer');
  };

  // Handle delete payment receive.
  const handleDeletePaymentReceive = () => {
    openAlert('payment-receive-delete', { paymentReceiveId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_payment_receive'} />}
          onClick={handleEditPaymentReceive}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeletePaymentReceive}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(PaymentReceiveActionsBar);
