import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBillDrawerContext } from './BillDrawerProvider';
import { BillMenuItem } from './utils';
import {
  Can,
  If,
  Icon,
  DrawerActionsBar,
  FormattedMessage as T,
} from '@/components';
import {
  BillAction,
  PaymentMadeAction,
  AbilitySubject,
} from '@/constants/abilityOption';
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
import { safeCallback, compose } from '@/utils';

interface BillDetailActionsBarInnerProps
  extends WithDialogActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

function BillDetailActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: BillDetailActionsBarInnerProps) {
  const history = useHistory();

  const { billId, bill } = useBillDrawerContext();

  // Handle edit bill.
  const onEditBill = () => {
    history.push(`/bills/${billId}/edit`);
    closeDrawer(DRAWERS.BILL_DETAILS);
  };

  // Handle convert to vendor credit.
  const handleConvertToVendorCredit = () => {
    history.push(`/vendor-credits/new?from_bill_id=${billId}`, {
      billId: billId,
    });
    closeDrawer(DRAWERS.BILL_DETAILS);
  };

  // Handle delete bill.
  const onDeleteBill = () => {
    openAlert('bill-delete', { billId });
  };

  // Handle quick bill payment .
  const handleQuickBillPayment = () => {
    openDialog('quick-payment-made', { billId });
  };

  // Handle allocate landed cost button click.
  const handleAllocateCostClick = () => {
    openDialog('allocate-landed-cost', { billId });
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
          <If condition={!!bill?.isOpen && !bill?.isFullyPaid}>
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="arrow-upward" iconSize={16} />}
              text={<T id={'add_payment'} />}
              onClick={handleQuickBillPayment}
            />
          </If>
        </Can>
        <Can I={BillAction.Delete} a={AbilitySubject.Bill}>
          <NavbarDivider />
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
              onAllocateLandedCost: handleAllocateCostClick,
            }}
          />
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const BillDetailActionsBar = compose(
  withDialogActions,
  withDrawerActions,
  withAlertActions,
)(BillDetailActionsBarInner);
