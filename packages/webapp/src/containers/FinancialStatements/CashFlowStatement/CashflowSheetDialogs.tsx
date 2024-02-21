import { DialogsName } from '@/constants/dialogs';
import { CashflowSheetPdfDialog } from './CashflowSheetPdfDialog';

export function CashflowSheetDialogs() {
  return (
    <>
      <CashflowSheetPdfDialog
        dialogName={DialogsName.CashflowSheetPdfPreview}
      />
    </>
  );
}
