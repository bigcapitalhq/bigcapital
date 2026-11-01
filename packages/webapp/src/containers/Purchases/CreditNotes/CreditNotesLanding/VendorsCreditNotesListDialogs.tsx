import { DialogsName } from '@/constants/dialogs';
import { VendorCreditBulkDeleteDialog } from '@/containers/Dialogs/VendorCredits/VendorCreditBulkDeleteDialog';

export function VendorsCreditNotesListDialogs() {
  return (
    <>
      <VendorCreditBulkDeleteDialog
        dialogName={DialogsName.VendorCreditBulkDelete}
      />
    </>
  );
}
