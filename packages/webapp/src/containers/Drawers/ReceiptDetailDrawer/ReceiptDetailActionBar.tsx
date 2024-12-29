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

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import {
  Can,
  Icon,
  FormattedMessage as T,
  DrawerActionsBar,
} from '@/components';
import { ReceiptMoreMenuItems } from './components';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import { SaleReceiptAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback, compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Receipt details actions bar.
 * @returns {React.JSX}
 */
function ReceiptDetailActionBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
  openDrawer
}) {
  const history = useHistory();
  const { receiptId } = useReceiptDetailDrawerContext();

  // Handle edit sale receipt.
  const onEditReceipt = () => {
    history.push(`/receipts/${receiptId}/edit`);
    closeDrawer(DRAWERS.RECEIPT_DETAILS);
  };

  // Handle delete sale receipt.
  const onDeleteReceipt = () => {
    openAlert('receipt-delete', { receiptId });
  };
  // Handle print receipt.
  const onPrintReceipt = () => {
    openDialog('receipt-pdf-preview', { receiptId });
  };
  // Handle notify via SMS.
  const handleNotifyViaSMS = () => {
    openDialog('notify-receipt-via-sms', { receiptId });
  };
  // Handle receipt mail action.
  const handleReceiptMail = () => {
    openDrawer(DRAWERS.RECEIPT_SEND_MAIL, { receiptId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={SaleReceiptAction.Edit} a={AbilitySubject.Receipt}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_receipt'} />}
            onClick={safeCallback(onEditReceipt)}
          />
          <NavbarDivider />
        </Can>
        <Can I={SaleReceiptAction.View} a={AbilitySubject.Receipt}>
          <Button
            className={Classes.MINIMAL}
            text={'Send Mail'}
            icon={<Icon icon="envelope" />}
            onClick={handleReceiptMail}
          />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={safeCallback(onPrintReceipt)}
          />
        </Can>
        <Can I={SaleReceiptAction.Delete} a={AbilitySubject.Receipt}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={safeCallback(onDeleteReceipt)}
          />
        </Can>
        <Can I={SaleReceiptAction.NotifyBySms} a={AbilitySubject.Receipt}>
          <NavbarDivider />
          <ReceiptMoreMenuItems
            payload={{
              onNotifyViaSMS: handleNotifyViaSMS,
            }}
          />
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(ReceiptDetailActionBar);
