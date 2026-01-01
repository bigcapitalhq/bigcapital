// @ts-nocheck
import React from 'react';
import { Button, NavbarGroup, Classes, Intent } from '@blueprintjs/core';

import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { useRefundVendorCreditNoteDrawerContext } from './RefundVendorCreditDrawerProvider';
import {
  Icon,
  DrawerActionsBar,
  FormattedMessage as T,
  Can,
} from '@/components';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';

import { compose } from '@/utils';

/**
 * Refund vendor credit actions bar.
 */
function RefundVendorCreditDetailActionsBar({
  // #withAlertActions
  openAlert,
}) {
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

export default compose(withAlertActions)(RefundVendorCreditDetailActionsBar);
