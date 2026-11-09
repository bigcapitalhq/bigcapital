import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteCreditNotes } from '@/hooks/query/credit-note';

export const useBulkDeleteCreditNotesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteCreditNotes();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.CreditNoteBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteCreditNotes: isValidatingBulkDelete,
  };
};
