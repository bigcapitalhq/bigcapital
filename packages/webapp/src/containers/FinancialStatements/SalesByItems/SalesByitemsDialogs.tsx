import { SalesByItemsPdfDialog } from './dialogs/SalesByItemsPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function SalesByItemsDialogs() {
  return (
    <>
      <SalesByItemsPdfDialog dialogName={DialogsName.SalesByItemsPdfPreview} />
    </>
  );
}
