// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteVendors } from '@/hooks/query/vendors';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeleteVendorsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteVendors();

  return useBulkDeleteDialog(
    DialogsName.VendorBulkDelete,
    validateBulkDeleteMutation,
  );
};

