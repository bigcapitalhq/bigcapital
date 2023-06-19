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

import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import {
  If,
  Can,
  Icon,
  DrawerActionsBar,
  FormattedMessage as T,
} from '@/components';
import {
  SaleInvoiceAction,
  PaymentReceiveAction,
  AbilitySubject,
} from '../../../constants/abilityOption';

import { compose } from '@/utils';
import { BadDebtMenuItem } from './utils';
import { DRAWERS } from '@/constants/drawers';

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
    closeDrawer(DRAWERS.INVOICE_DETAILS);
  };

  // Handle convert to invoice.
  const handleConvertToCreditNote = () => {
    history.push(`/credit-notes/new?from_invoice_id=${invoiceId}`, {
      invoiceId: invoiceId,
    });
    closeDrawer(DRAWERS.INVOICE_DETAILS);
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

  // Handle canceled write-off invoice.
  const handleCancelBadDebtInvoice = () => {
    openAlert('cancel-bad-debt', { invoiceId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={SaleInvoiceAction.Edit} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_invoice'} />}
            onClick={handleEditInvoice}
          />
          <NavbarDivider />
        </Can>
        <Can I={PaymentReceiveAction.Create} a={AbilitySubject.PaymentReceive}>
          <If condition={invoice.is_delivered && !invoice.is_fully_paid}>
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="arrow-downward" iconSize={18} />}
              text={<T id={'add_payment'} />}
              onClick={handleQuickPaymentInvoice}
            />
          </If>
          <NavbarDivider />
        </Can>
        <Can I={SaleInvoiceAction.View} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={handlePrintInvoice}
          />
        </Can>
        <Can I={SaleInvoiceAction.Delete} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteInvoice}
          />
        </Can>
        <Can I={SaleInvoiceAction.Writeoff} a={AbilitySubject.Invoice}>
          <NavbarDivider />
          <BadDebtMenuItem
            payload={{
              onBadDebt: handleBadDebtInvoice,
              onCancelBadDebt: handleCancelBadDebtInvoice,
              onNotifyViaSMS: handleNotifyViaSMS,
              onConvert: handleConvertToCreditNote,
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
)(InvoiceDetailActionsBar);
