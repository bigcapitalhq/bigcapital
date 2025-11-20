// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteInvoices } from '@/hooks/query/invoices';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeleteInvoicesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteInvoices();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(DialogsName.InvoiceBulkDelete, validateBulkDeleteMutation);

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteInvoices: isValidatingBulkDelete,
  };
};