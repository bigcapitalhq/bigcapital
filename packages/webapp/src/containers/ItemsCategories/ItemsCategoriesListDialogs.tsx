import { DialogsName } from '@/constants/dialogs';
import { ItemCategoryBulkDeleteDialog } from '@/containers/Dialogs/Items/ItemCategoryBulkDeleteDialog';

export function ItemsCategoriesListDialogs() {
  return (
    <>
      <ItemCategoryBulkDeleteDialog
        dialogName={DialogsName.ItemCategoryBulkDelete}
      />
    </>
  );
}
