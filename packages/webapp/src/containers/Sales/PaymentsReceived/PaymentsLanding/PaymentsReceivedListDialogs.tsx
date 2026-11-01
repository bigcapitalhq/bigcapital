import { DialogsName } from '@/constants/dialogs';
import { index as PaymentReceivePdfPreviewDialog } from '@/containers/Dialogs/PaymentReceivePdfPreviewDialog';
import { PaymentReceivedBulkDeleteDialog } from '@/containers/Dialogs/PaymentsReceived/PaymentReceivedBulkDeleteDialog';

export function PaymentsReceivedListDialogs() {
  return (
    <>
      <PaymentReceivedBulkDeleteDialog
        dialogName={DialogsName.PaymentReceivedBulkDelete}
      />
      <PaymentReceivePdfPreviewDialog dialogName={DialogsName.PaymentPdfForm} />
    </>
  );
}
