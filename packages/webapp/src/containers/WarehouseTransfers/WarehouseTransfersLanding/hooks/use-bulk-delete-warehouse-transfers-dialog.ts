import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteWarehouseTransfers } from '@/hooks/query';

export const useBulkDeleteWarehouseTransfersDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteWarehouseTransfers();
  const {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDelete,
  } = useBulkDeleteDialog(
    DialogsName.WarehouseTransferBulkDelete,
    validateBulkDeleteMutation,
  );

  return {
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    isValidatingBulkDeleteWarehouseTransfers: isValidatingBulkDelete,
  };
};
