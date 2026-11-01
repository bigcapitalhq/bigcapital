import { DialogsName } from '@/constants/dialogs';
import { ReceiptBulkDeleteDialog } from '@/containers/Dialogs/Receipts/ReceiptBulkDeleteDialog';

export function ReceiptsListDialogs() {
  return (
    <>
      <ReceiptBulkDeleteDialog dialogName={DialogsName.ReceiptBulkDelete} />
    </>
  );
}
