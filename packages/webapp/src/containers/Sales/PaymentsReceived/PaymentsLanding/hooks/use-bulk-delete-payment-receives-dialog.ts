// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeletePaymentReceives } from '@/hooks/query/paymentReceives';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeletePaymentReceivesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeletePaymentReceives();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(DialogsName.PaymentReceivedBulkDelete, validateBulkDeleteMutation);

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeletePaymentReceives: isValidatingBulkDelete,
  };
};

