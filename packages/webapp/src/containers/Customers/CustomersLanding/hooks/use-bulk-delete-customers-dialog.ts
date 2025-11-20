// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteCustomers } from '@/hooks/query/customers';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeleteCustomersDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteCustomers();

  return useBulkDeleteDialog(
    DialogsName.CustomerBulkDelete,
    validateBulkDeleteMutation,
  );
};

