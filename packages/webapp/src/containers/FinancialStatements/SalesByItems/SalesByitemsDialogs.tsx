import { DialogsName } from '@/constants/dialogs';
import { SalesByItemsPdfDialog } from './dialogs/SalesByItemsPdfDialog';

export function SalesByItemsDialogs() {
  return (
    <>
      <SalesByItemsPdfDialog dialogName={DialogsName.SalesByItemsPdfPreview} />
    </>
  );
}
