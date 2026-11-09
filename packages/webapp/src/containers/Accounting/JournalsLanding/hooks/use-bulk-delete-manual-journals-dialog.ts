import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteManualJournals } from '@/hooks/query/manual-journals';

export const useBulkDeleteManualJournalsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteManualJournals();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.ManualJournalBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteManualJournals: isValidatingBulkDelete,
  };
};
