// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteReceipts } from '@/hooks/query/receipts';

export const useBulkDeleteReceiptsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteReceipts();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.ReceiptBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteReceipts: isValidatingBulkDelete,
  };
};
