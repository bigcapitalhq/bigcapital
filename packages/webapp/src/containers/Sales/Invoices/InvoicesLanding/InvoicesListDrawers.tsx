import { DRAWERS } from '@/constants/drawers';
import { index as InvoiceDetailDrawer } from '@/containers/Drawers/InvoiceDetailDrawer';
import { InvoiceSendMailDrawer } from '@/containers/Sales/Invoices/InvoiceSendMailDrawer/InvoiceSendMailDrawer';

export function InvoicesListDrawers() {
  return (
    <>
      <InvoiceDetailDrawer name={DRAWERS.INVOICE_DETAILS} />
      <InvoiceSendMailDrawer name={DRAWERS.INVOICE_SEND_MAIL} />
    </>
  );
}
