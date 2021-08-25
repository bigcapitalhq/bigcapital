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

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T } from 'components';

import { safeCallback, compose } from 'utils';

function PaymentMadeDetailActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const { paymentMadeId } = usePaymentMadeDetailContext();

  // Handle edit payment made.
  const onEditPaymentMade = () => {
    return paymentMadeId
      ? (history.push(`/payment-mades/${paymentMadeId}/edit`),
        closeDrawer('payment-made-detail-drawer'))
      : null;
  };

  // Handle delete payment made.
  const onDeletePaymentMade = () => {
    return paymentMadeId
      ? (openAlert('payment-made-delete', { paymentMadeId }),
        closeDrawer('payment-made-detail-drawer'))
      : null;
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_payment_made'} />}
          onClick={safeCallback(onEditPaymentMade)}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeletePaymentMade)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(PaymentMadeDetailActionsBar);
