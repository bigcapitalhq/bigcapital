import { InvoiceMailDialogBoot } from './InvoiceMailDialogBoot';
import { InvoiceMailDialogForm } from './InvoiceMailDialogForm';

interface InvoiceMailDialogContentProps {
  dialogName: string;
  invoiceId: number;
}
export default function InvoiceMailDialogContent({
  dialogName,
  invoiceId,
}: InvoiceMailDialogContentProps) {
  return (
    <InvoiceMailDialogBoot invoiceId={invoiceId}>
      <InvoiceMailDialogForm />
    </InvoiceMailDialogBoot>
  );
}
