import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteExpenses } from '@/hooks/query/expenses';

export const useBulkDeleteExpensesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteExpenses();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.ExpenseBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteExpenses: isValidatingBulkDelete,
  };
};
