import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeletePaymentReceives } from '@/hooks/query/payment-receives';

export const useBulkDeletePaymentReceivesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeletePaymentReceives();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.PaymentReceivedBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeletePaymentReceives: isValidatingBulkDelete,
  };
};
