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

import { Icon, FormattedMessage as T } from 'components';

import { safeCallback, compose } from 'utils';

function ReceiptDetailTab({
  receiptId,
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Handle edit sale receipt.
  const onEditReceipt = () => {
    return receiptId
      ? (history.push(`/receipts/${receiptId}/edit`),
        closeDrawer('receipt-detail-drawer'))
      : null;
  };

  // Handle delete sale receipt.
  const onDeleteReceipt = () => {
    return receiptId
      ? (openAlert('receipt-delete', { receiptId }),
        closeDrawer('receipt-detail-drawer'))
      : null;
  };
  // Handle print receipt.
  const onPrintReceipt = () => {
    openDialog('receipt-pdf-preview', { receiptId });
  };
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_receipt'} />}
          onClick={safeCallback(onEditReceipt)}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" />}
          text={<T id={'print'} />}
          onClick={safeCallback(onPrintReceipt)}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeleteReceipt)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(ReceiptDetailTab);
