import { DialogsName } from '@/constants/dialogs';
import { ExpenseBulkDeleteDialog } from '@/containers/Dialogs/Expenses/ExpenseBulkDeleteDialog';

export function ExpensesListDialogs() {
  return (
    <>
      <ExpenseBulkDeleteDialog dialogName={DialogsName.ExpenseBulkDelete} />
    </>
  );
}
