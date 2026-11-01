import { CashflowSheetPdfDialog } from './CashflowSheetPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function CashflowSheetDialogs() {
  return (
    <>
      <CashflowSheetPdfDialog
        dialogName={DialogsName.CashflowSheetPdfPreview}
      />
    </>
  );
}
