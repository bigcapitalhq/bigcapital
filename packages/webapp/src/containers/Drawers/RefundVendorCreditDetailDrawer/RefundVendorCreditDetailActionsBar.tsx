import { Button, NavbarGroup, Classes, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useRefundVendorCreditNoteDrawerContext } from './RefundVendorCreditDrawerProvider';
import {
  Icon,
  DrawerActionsBar,
  FormattedMessage as T,
  Can,
} from '@/components';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';

type RefundVendorCreditDetailActionsBarInnerProps = WithAlertActionsProps;

/**
 * Refund vendor credit actions bar.
 */
function RefundVendorCreditDetailActionsBarInner({
  // #withAlertActions
  openAlert,
}: RefundVendorCreditDetailActionsBarInnerProps) {
  const { refundTransactionId } = useRefundVendorCreditNoteDrawerContext();

  // Handle delete refund vendor credit.
  const handleDeleteRefundVendorCredit = () => {
    openAlert('refund-vendor-delete', { vendorCreditId: refundTransactionId });
  };

  return (
    <Can I={VendorCreditAction.Delete} a={AbilitySubject.VendorCredit}>
      <DrawerActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteRefundVendorCredit}
          />
        </NavbarGroup>
      </DrawerActionsBar>
    </Can>
  );
}

export const RefundVendorCreditDetailActionsBar = FF.pipe(
  RefundVendorCreditDetailActionsBarInner,
  withAlertActions,
);
