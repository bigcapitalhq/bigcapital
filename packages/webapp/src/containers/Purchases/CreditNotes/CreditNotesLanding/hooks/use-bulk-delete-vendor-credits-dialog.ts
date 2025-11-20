// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteVendorCredits } from '@/hooks/query/vendorCredit';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeleteVendorCreditsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteVendorCredits();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(DialogsName.VendorCreditBulkDelete, validateBulkDeleteMutation);

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteVendorCredits: isValidatingBulkDelete,
  };
};

