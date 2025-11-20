// @ts-nocheck
import { DialogsName } from '@/constants/dialogs';
import { useValidateBulkDeleteItems } from '@/hooks/query/items';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';

export const useBulkDeleteItemsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteItems();

  return useBulkDeleteDialog(
    DialogsName.ItemBulkDelete,
    validateBulkDeleteMutation,
  );
};

