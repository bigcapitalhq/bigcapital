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
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';
import { VendorCreditMenuItem } from './utils';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import {
  If,
  Icon,
  FormattedMessage as T,
  DashboardActionsBar,
  Can,
} from '@/components';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Vendor credit detail actions bar.
 */
function VendorCreditDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
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

  return (
    <DashboardActionsBar>
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
          <If condition={!vendorCredit.is_closed && !vendorCredit.is_draft}>
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
          <If condition={!vendorCredit.is_closed && !vendorCredit.is_draft}>
            <NavbarDivider />
            <VendorCreditMenuItem
              payload={{
                onReconcile: handleReconcileVendorCredit,
              }}
            />
          </If>
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertsActions,
  withDrawerActions,
)(VendorCreditDetailActionsBar);
