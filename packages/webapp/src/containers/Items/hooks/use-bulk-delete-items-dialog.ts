import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteItems } from '@/hooks/query/items';

export const useBulkDeleteItemsDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteItems();

  return useBulkDeleteDialog(
    DialogsName.ItemBulkDelete,
    validateBulkDeleteMutation,
  );
};
