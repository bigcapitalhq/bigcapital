import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteVendorCredits } from '@/hooks/query/vendor-credit';

export const useBulkDeleteVendorCreditsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteVendorCredits();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.VendorCreditBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteVendorCredits: isValidatingBulkDelete,
  };
};
