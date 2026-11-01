import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteAccounts } from '@/hooks/query/accounts';

export const useBulkDeleteAccountsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteAccounts();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.AccountBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteAccounts: isValidatingBulkDelete,
  };
};
