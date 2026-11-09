import { DialogsName } from '@/constants/dialogs';
import { PaymentMadeBulkDeleteDialog } from '@/containers/Dialogs/PaymentsMade/PaymentMadeBulkDeleteDialog';

export function PaymentMadeListDialogs() {
  return (
    <>
      <PaymentMadeBulkDeleteDialog
        dialogName={DialogsName.PaymentMadeBulkDelete}
      />
    </>
  );
}
