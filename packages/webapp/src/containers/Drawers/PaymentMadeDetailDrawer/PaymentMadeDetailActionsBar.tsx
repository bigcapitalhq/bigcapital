import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';
import {
  Can,
  Icon,
  FormattedMessage as T,
  DrawerActionsBar,
} from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface PaymentMadeDetailActionsBarInnerProps
  extends WithDialogActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Payment made - Details panel - actions bar.
 */
function PaymentMadeDetailActionsBarInner({
  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: PaymentMadeDetailActionsBarInnerProps) {
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
    <DrawerActionsBar>
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
    </DrawerActionsBar>
  );
}

export const PaymentMadeDetailActionsBar = compose(
  withDialogActions,
  withDrawerActions,
  withAlertActions,
)(PaymentMadeDetailActionsBarInner);
