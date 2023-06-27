// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import {
  DashboardActionsBar,
  Can,
  Icon,
  FormattedMessage as T,
} from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';
import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Payment made - Details panel - actions bar.
 */
function PaymentMadeDetailActionsBar({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const { paymentMadeId } = usePaymentMadeDetailContext();

  // Handle edit payment made.
  const handleEditPaymentMade = () => {
    history.push(`/payments-made/${paymentMadeId}/edit`);
    closeDrawer(DRAWERS.PAYMENT_MADE_DETAILS);
  };

  // Handle delete payment made.
  const handleDeletePaymentMade = () => {
    openAlert('payment-made-delete', { paymentMadeId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={PaymentMadeAction.Edit} a={AbilitySubject.PaymentMade}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_payment_made'} />}
            onClick={handleEditPaymentMade}
          />
        </Can>
        <Can I={PaymentMadeAction.Delete} a={AbilitySubject.PaymentMade}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeletePaymentMade}
          />
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(PaymentMadeDetailActionsBar);
