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

import { useBillDrawerContext } from './BillDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { If, Icon, FormattedMessage as T } from 'components';

import { safeCallback, compose } from 'utils';

function BillDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  const { billId, bill } = useBillDrawerContext();

  // Handle edit bill.
  const onEditBill = () => {
    history.push(`/bills/${billId}/edit`);
    closeDrawer('bill-drawer');
  };

  // Handle delete bill.
  const onDeleteBill = () => {
    openAlert('bill-delete', { billId });
  };

  // Handle quick bill payment .
  const handleQuickBillPayment = () => {
    openDialog('quick-payment-made', { billId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_bill'} />}
          onClick={safeCallback(onEditBill)}
        />
        <NavbarDivider />
        <If condition={bill.is_open && !bill.is_fully_paid}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="quick-payment-16" iconSize={16} />}
            text={<T id={'add_payment'} />}
            onClick={handleQuickBillPayment}
          />
        </If>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeleteBill)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(BillDetailActionsBar);
