import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteExpenses } from '@/hooks/query/expenses';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

type UseBulkDeleteExpensesDialogReturn = {
  openBulkDeleteDialog: (ids: number[]) => Promise<void> | void;
  closeBulkDeleteDialog: () => void;
  isValidatingBulkDeleteExpenses: boolean;
};

export const useBulkDeleteExpensesDialog = (): UseBulkDeleteExpensesDialogReturn => {
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
