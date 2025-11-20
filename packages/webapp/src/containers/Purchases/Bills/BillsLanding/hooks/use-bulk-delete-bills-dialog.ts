// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteBills } from '@/hooks/query/bills';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeleteBillsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteBills();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(DialogsName.BillBulkDelete, validateBulkDeleteMutation);

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteBills: isValidatingBulkDelete,
  };
};

