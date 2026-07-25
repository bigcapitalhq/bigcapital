import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteCustomers } from '@/hooks/query/customers';

export const useBulkDeleteCustomersDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteCustomers();

  return useBulkDeleteDialog(
    DialogsName.CustomerBulkDelete,
    validateBulkDeleteMutation,
  );
};
