import { DialogsName } from '@/constants/dialogs';
import { ManualJournalBulkDeleteDialog } from '@/containers/Dialogs/ManualJournals/ManualJournalBulkDeleteDialog';

export function ManualJournalsListDialogs() {
  return (
    <>
      <ManualJournalBulkDeleteDialog
        dialogName={DialogsName.ManualJournalBulkDelete}
      />
    </>
  );
}
