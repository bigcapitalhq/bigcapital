import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeletePaymentMades } from '@/hooks/query/payment-mades';

export const useBulkDeletePaymentMadesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeletePaymentMades();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.PaymentMadeBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeletePaymentMades: isValidatingBulkDelete,
  };
};
