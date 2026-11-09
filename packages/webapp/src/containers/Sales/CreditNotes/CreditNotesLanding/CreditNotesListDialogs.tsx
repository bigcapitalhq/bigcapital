import { DialogsName } from '@/constants/dialogs';
import { index as CreditNotePdfPreviewDialog } from '@/containers/Dialogs/CreditNotePdfPreviewDialog';
import { CreditNoteBulkDeleteDialog } from '@/containers/Dialogs/CreditNotes/CreditNoteBulkDeleteDialog';

export function CreditNotesListDialogs() {
  return (
    <>
      <CreditNoteBulkDeleteDialog
        dialogName={DialogsName.CreditNoteBulkDelete}
      />
      <CreditNotePdfPreviewDialog dialogName={DialogsName.CreditNotePdfForm} />
    </>
  );
}
