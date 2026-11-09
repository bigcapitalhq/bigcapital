import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteVendors } from '@/hooks/query/vendors';

export const useBulkDeleteVendorsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteVendors();

  return useBulkDeleteDialog(
    DialogsName.VendorBulkDelete,
    validateBulkDeleteMutation,
  );
};
