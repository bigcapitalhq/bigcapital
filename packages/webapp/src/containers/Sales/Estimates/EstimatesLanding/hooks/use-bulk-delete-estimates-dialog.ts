import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteEstimates } from '@/hooks/query/estimates';

export const useBulkDeleteEstimatesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteEstimates();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.EstimateBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteEstimates: isValidatingBulkDelete,
  };
};
