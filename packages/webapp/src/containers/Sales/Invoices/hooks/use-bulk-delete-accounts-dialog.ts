import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteInvoices } from '@/hooks/query/invoices';

export const useBulkDeleteInvoicesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteInvoices();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.InvoiceBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteInvoices: isValidatingBulkDelete,
  };
};
