import { DialogsName } from '@/constants/dialogs';
import { ItemBulkDeleteDialog } from '@/containers/Dialogs/Items/ItemBulkDeleteDialog';

export function ItemsListDialogs() {
  return (
    <>
      <ItemBulkDeleteDialog dialogName={DialogsName.ItemBulkDelete} />
    </>
  );
}
