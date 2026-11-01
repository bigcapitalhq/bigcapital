import { PurchasesByItemsPdfDialog } from './dialogs/PurchasesByItemsDialog';
import { DialogsName } from '@/constants/dialogs';

export function PurchasesByItemsDialogs() {
  return (
    <>
      <PurchasesByItemsPdfDialog
        dialogName={DialogsName.PurchasesByItemsPdfPreview}
      />
    </>
  );
}
