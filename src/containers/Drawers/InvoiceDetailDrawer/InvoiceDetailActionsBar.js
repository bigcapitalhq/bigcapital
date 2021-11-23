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

import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { If, Can, Icon, FormattedMessage as T } from 'components';
import {
  Invoice_Abilities,
  Payment_Receive_Abilities,
  AbilitySubject,
} from '../../../common/abilityOption';

import { compose } from 'utils';

import { BadDebtMenuItem } from './utils';

/**
 * Invoice details action bar.
 */
function InvoiceDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Invoice detail drawer context.
  const { invoiceId, invoice } = useInvoiceDetailDrawerContext();

  // Handle edit sale invoice.
  const handleEditInvoice = () => {
    history.push(`/invoices/${invoiceId}/edit`);
    closeDrawer('invoice-detail-drawer');
  };

  // Handle delete sale invoice.
  const handleDeleteInvoice = () => {
    openAlert('invoice-delete', { invoiceId });
  };

  // Handle print invoices.
  const handlePrintInvoice = () => {
    openDialog('invoice-pdf-preview', { invoiceId });
  };

  // Handle quick payment invoice.
  const handleQuickPaymentInvoice = () => {
    openDialog('quick-payment-receive', { invoiceId });
  };

  // Handle write-off invoice.
  const handleBadDebtInvoice = () => {
    openDialog('write-off-bad-debt', { invoiceId });
  };
  // Handle notify via SMS.
  const handleNotifyViaSMS = () => {
    openDialog('notify-invoice-via-sms', { invoiceId });
  };

  // Handle cancele write-off invoice.
  const handleCancelBadDebtInvoice = () => {
    openAlert('cancel-bad-debt', { invoiceId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={Invoice_Abilities.Edit} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_invoice'} />}
            onClick={handleEditInvoice}
          />

          <NavbarDivider />
        </Can>
        <Can I={Payment_Receive_Abilities.Create} a={AbilitySubject.PaymentReceive}>
          <If condition={invoice.is_delivered && !invoice.is_fully_paid}>
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="quick-payment-16" iconSize={16} />}
              text={<T id={'add_payment'} />}
              onClick={handleQuickPaymentInvoice}
            />
          </If>
          <NavbarDivider />
        </Can>
        <Can I={Invoice_Abilities.View} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={handlePrintInvoice}
          />
        </Can>
        <Can I={Invoice_Abilities.Delete} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteInvoice}
          />
          <NavbarDivider />
        </Can>
        <Can I={Invoice_Abilities.BadDebt} a={AbilitySubject.Invoice}>
          <BadDebtMenuItem
            payload={{
              onBadDebt: handleBadDebtInvoice,
              onCancelBadDebt: handleCancelBadDebtInvoice,
              onNotifyViaSMS: handleNotifyViaSMS,
            }}
          />
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(InvoiceDetailActionsBar);
