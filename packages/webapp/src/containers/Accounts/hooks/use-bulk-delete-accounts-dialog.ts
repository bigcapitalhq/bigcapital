// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteAccounts } from '@/hooks/query/accounts';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeleteAccountsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteAccounts();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(DialogsName.AccountBulkDelete, validateBulkDeleteMutation);

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteAccounts: isValidatingBulkDelete,
  };
};

