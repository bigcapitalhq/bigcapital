import { DialogsName } from '@/constants/dialogs';
import { VendorBulkDeleteDialog } from '@/containers/Dialogs/Vendors/VendorBulkDeleteDialog';

export function VendorsListDialogs() {
  return (
    <>
      <VendorBulkDeleteDialog dialogName={DialogsName.VendorBulkDelete} />
    </>
  );
}
