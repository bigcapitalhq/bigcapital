import { DialogsName } from '@/constants/dialogs';
import { useBulkDeleteDialog } from '@/hooks/dialogs/useBulkDeleteDialog';
import { useValidateBulkDeleteItemCategories } from '@/hooks/query/items-categories';

export const useBulkDeleteItemCategoriesDialog = () => {
  const validateBulkDeleteMutation = useValidateBulkDeleteItemCategories();

  return useBulkDeleteDialog(
    DialogsName.ItemCategoryBulkDelete,
    validateBulkDeleteMutation,
  );
};
