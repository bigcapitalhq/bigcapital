import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { VendorCreditMenuItem } from './utils';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';
import {
  If,
  Icon,
  FormattedMessage as T,
  DrawerActionsBar,
  Can,
} from '@/components';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';
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

interface VendorCreditDetailActionsBarInnerProps
  extends WithDialogActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Vendor credit detail actions bar.
 */
function VendorCreditDetailActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: VendorCreditDetailActionsBarInnerProps) {
  const history = useHistory();
  const { vendorCreditId, vendorCredit } = useVendorCreditDetailDrawerContext();

  // Handle edit credit note.
  const handleEditVendorCredit = () => {
    history.push(`/vendor-credits/${vendorCreditId}/edit`);
    closeDrawer(DRAWERS.VENDOR_CREDIT_DETAILS);
  };

  // Handle delete credit note.
  const handleDeleteVendorCredit = () => {
    openAlert('vendor-credit-delete', { vendorCreditId });
  };

  const handleRefundVendorCredit = () => {
    openDialog('refund-vendor-credit', { vendorCreditId });
  };

  const handleReconcileVendorCredit = () => {
    openDialog('reconcile-vendor-credit', { vendorCreditId });
  };

  if (!vendorCredit) {
    return null;
  }

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={VendorCreditAction.Edit} a={AbilitySubject.VendorCredit}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'vendor_credits.label.edit_vendor_credit'} />}
            onClick={handleEditVendorCredit}
          />
          <NavbarDivider />
        </Can>
        <Can I={VendorCreditAction.Refund} a={AbilitySubject.VendorCredit}>
          <If condition={!vendorCredit.isClosed && !vendorCredit.isDraft}>
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="arrow-downward" iconSize={18} />}
              text={<T id={'refund'} />}
              onClick={handleRefundVendorCredit}
            />
          </If>
        </Can>
        <Can I={VendorCreditAction.Delete} a={AbilitySubject.VendorCredit}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteVendorCredit}
          />
        </Can>
        <Can I={VendorCreditAction.Edit} a={AbilitySubject.VendorCredit}>
          <If condition={!vendorCredit.isClosed && !vendorCredit.isDraft}>
            <NavbarDivider />
            <VendorCreditMenuItem
              payload={{
                onReconcile: handleReconcileVendorCredit,
              }}
            />
          </If>
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const VendorCreditDetailActionsBar = compose(
  withDialogActions,
  withAlertActions,
  withDrawerActions,
)(VendorCreditDetailActionsBarInner);
