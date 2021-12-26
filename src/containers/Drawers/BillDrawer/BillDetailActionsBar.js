import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';

import { useBillDrawerContext } from './BillDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import {
  Can,
  If,
  Icon,
  DrawerActionsBar,
  FormattedMessage as T,
} from 'components';
import {
  BillAction,
  PaymentMadeAction,
  AbilitySubject,
} from '../../../common/abilityOption';
import { BillMenuItem } from './utils';

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

  // Handle convert to vendor credit.
  const handleConvertToVendorCredit = () => {
    history.push(`/vendor-credits/new?from_bill_id=${billId}`, {
      billId: billId,
    });
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
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={BillAction.Edit} a={AbilitySubject.Bill}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_bill'} />}
            onClick={safeCallback(onEditBill)}
          />
          <NavbarDivider />
        </Can>
        <Can I={PaymentMadeAction.Create} a={AbilitySubject.PaymentMade}>
          <If condition={bill.is_open && !bill.is_fully_paid}>
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="arrow-upward" iconSize={16} />}
              text={<T id={'add_payment'} />}
              onClick={handleQuickBillPayment}
            />
          </If>
          <NavbarDivider />
        </Can>
        <Can I={BillAction.Delete} a={AbilitySubject.Bill}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={safeCallback(onDeleteBill)}
          />
        </Can>
        <Can I={BillAction.Edit} a={AbilitySubject.Bill}>
          <NavbarDivider />
          <BillMenuItem
            payload={{
              onConvert: handleConvertToVendorCredit,
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
)(BillDetailActionsBar);
