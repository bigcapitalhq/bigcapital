import { DialogsName } from '@/constants/dialogs';
import { BillBulkDeleteDialog } from '@/containers/Dialogs/Bills/BillBulkDeleteDialog';

export function BillsListDialogs() {
  return (
    <>
      <BillBulkDeleteDialog dialogName={DialogsName.BillBulkDelete} />
    </>
  );
}
