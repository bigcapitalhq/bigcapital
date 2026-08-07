// @ts-nocheck
import { Button, NavbarGroup, Classes, Intent } from '@blueprintjs/core';
import React from 'react';
import { useRefundCreditNoteDrawerContext } from './RefundCreditNoteDrawerProvider';
import {
  Icon,
  DrawerActionsBar,
  FormattedMessage as T,
  Can,
} from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { compose } from '@/utils';

/**
 * Refund credit note actions bar.
 */
function RefundCreditNoteDetailActionsBarInner({
  // #withAlertActions
  openAlert,
}) {
  const { refundTransactionId } = useRefundCreditNoteDrawerContext();

  // Handle delete refund credit.
  const handleDeleteRefundCreditNote = () => {
    openAlert('refund-credit-delete', { creditNoteId: refundTransactionId });
  };

  return (
    <Can I={CreditNoteAction.Delete} a={AbilitySubject.CreditNote}>
      <DrawerActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteRefundCreditNote}
          />
        </NavbarGroup>
      </DrawerActionsBar>
    </Can>
  );
}

export const RefundCreditNoteDetailActionsBar = compose(withAlertActions)(
  RefundCreditNoteDetailActionsBarInner,
);
