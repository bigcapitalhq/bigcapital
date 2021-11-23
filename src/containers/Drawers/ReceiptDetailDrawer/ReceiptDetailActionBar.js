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

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Can, Icon, FormattedMessage as T, MoreMenuItems } from 'components';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import {
  Receipt_Abilities,
  AbilitySubject,
} from '../../../common/abilityOption';

import { safeCallback, compose } from 'utils';

function ReceiptDetailActionBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();
  const { receiptId } = useReceiptDetailDrawerContext();

  // Handle edit sale receipt.
  const onEditReceipt = () => {
    history.push(`/receipts/${receiptId}/edit`);
    closeDrawer('receipt-detail-drawer');
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
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={Receipt_Abilities.Edit} a={AbilitySubject.Receipt}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_receipt'} />}
            onClick={safeCallback(onEditReceipt)}
          />
          <NavbarDivider />
        </Can>
        <Can I={Receipt_Abilities.View} a={AbilitySubject.Receipt}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={safeCallback(onPrintReceipt)}
          />
        </Can>
        <Can I={Receipt_Abilities.Delete} a={AbilitySubject.Receipt}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={safeCallback(onDeleteReceipt)}
          />
          <NavbarDivider />
        </Can>
        <MoreMenuItems
          payload={{
            onNotifyViaSMS: handleNotifyViaSMS,
          }}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(ReceiptDetailActionBar);
