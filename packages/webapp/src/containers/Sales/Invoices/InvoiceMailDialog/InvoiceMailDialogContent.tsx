import { InvoiceMailDialogBoot } from './InvoiceMailDialogBoot';
import { InvoiceMailDialogForm } from './InvoiceMailDialogForm';

interface InvoiceMailDialogContentProps {
  dialogName: string;
  invoiceId: number;

  // Redirect to invoices list after submitting the message.
  redirectToInvoicesList?: boolean;
}
export default function InvoiceMailDialogContent({
  dialogName,
  invoiceId,
  redirectToInvoicesList,
}: InvoiceMailDialogContentProps) {
  return (
    <InvoiceMailDialogBoot
      invoiceId={invoiceId}
      redirectToInvoicesList={redirectToInvoicesList}
    >
      <InvoiceMailDialogForm />
    </InvoiceMailDialogBoot>
  );
}
