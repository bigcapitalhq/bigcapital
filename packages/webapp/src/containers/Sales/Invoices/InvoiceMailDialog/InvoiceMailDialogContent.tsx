import { InvoiceMailDialogBoot } from './InvoiceMailDialogBoot';
import { InvoiceMailDialogForm } from './InvoiceMailDialogForm';

export interface InvoiceMailDialogContentProps {
  invoiceId: number;
  onFormSubmit?: () => void;
  onCancelClick?: () => void;
}
export default function InvoiceMailDialogContent({
  invoiceId,
  onFormSubmit,
  onCancelClick,
}: InvoiceMailDialogContentProps) {
  return (
    <InvoiceMailDialogBoot invoiceId={invoiceId}>
      <InvoiceMailDialogForm
        onFormSubmit={onFormSubmit}
        onCancelClick={onCancelClick}
      />
    </InvoiceMailDialogBoot>
  );
}
