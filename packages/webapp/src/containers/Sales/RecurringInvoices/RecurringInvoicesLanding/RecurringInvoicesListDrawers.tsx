import { DRAWERS } from '@/constants/drawers';
import { index as InvoiceDetailDrawer } from '@/containers/Drawers/InvoiceDetailDrawer';
import { index as RecurringInvoiceDetailDrawer } from '@/containers/Drawers/RecurringInvoiceDetailDrawer';
import { InvoiceSendMailDrawer } from '@/containers/Sales/Invoices/InvoiceSendMailDrawer/InvoiceSendMailDrawer';

export function RecurringInvoicesListDrawers() {
  return (
    <>
      <RecurringInvoiceDetailDrawer name={DRAWERS.RECURRING_INVOICE_DETAILS} />
      <InvoiceDetailDrawer name={DRAWERS.INVOICE_DETAILS} />
      <InvoiceSendMailDrawer name={DRAWERS.INVOICE_SEND_MAIL} />
    </>
  );
}
