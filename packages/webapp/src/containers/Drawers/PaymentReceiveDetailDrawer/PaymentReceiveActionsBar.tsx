import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, NavbarGroup, Classes, NavbarDivider, Intent } from '@blueprintjs/core';

import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { PaymentReceiveMoreMenuItems } from './utils';
import { Can, Icon, FormattedMessage as T, DrawerActionsBar } from '@/components';
import { PaymentReceiveAction, AbilitySubject } from '@/constants/abilityOption';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';
import { DialogsName } from '@/constants/dialogs';

/**
 * Payment receive actions bar.
 */
function PaymentReceiveActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,

  // #withDialogActions
  openDialog,
}) {
  const history = useHistory();

  // Retrieve the payment receive drawer context.
  const { paymentReceiveId } = usePaymentReceiveDetailContext();

  // Handle edit payment receive.
  const handleEditPaymentReceive = () => {
    history.push(`/payment-receives/${paymentReceiveId}/edit`);
    closeDrawer(DRAWERS.PAYMENT_RECEIVE_DETAILS);
  };

  // Handle delete payment receive.
  const handleDeletePaymentReceive = () => {
    openAlert('payment-receive-delete', { paymentReceiveId });
  };

  // Handle notify via SMS.
  const handleNotifyViaSMS = () => {
    openDialog('notify-payment-via-sms', { paymentReceiveId });
  };

  // Handle print payment receive.
  const handlePrintPaymentReceive = () => {
    openDialog('payment-pdf-preview', { paymentReceiveId });
  };

  const handleMailPaymentReceive = () => {
    openDialog(DialogsName.PaymentMail, { paymentReceiveId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={PaymentReceiveAction.Edit} a={AbilitySubject.PaymentReceive}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_payment_receive'} />}
            onClick={handleEditPaymentReceive}
          />
          <NavbarDivider />
        </Can>
        <Can I={PaymentReceiveAction.View} a={AbilitySubject.PaymentReceive}>
          <Button
            className={Classes.MINIMAL}
            text={'Send Mail'}
            icon={<Icon icon="envelope" />}
            onClick={handleMailPaymentReceive}
          />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={handlePrintPaymentReceive}
          />
          <NavbarDivider />
        </Can>
        <Can I={PaymentReceiveAction.Delete} a={AbilitySubject.PaymentReceive}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeletePaymentReceive}
          />
        </Can>
        <Can I={PaymentReceiveAction.NotifyBySms} a={AbilitySubject.PaymentReceive}>
          <NavbarDivider />
          <PaymentReceiveMoreMenuItems
            payload={{
              onNotifyViaSMS: handleNotifyViaSMS,
            }}
          />
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export default compose(withDialogActions, withDrawerActions, withAlertsActions)(PaymentReceiveActionsBar);
