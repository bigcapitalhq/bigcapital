import { TrialBalanceSheetPdfDialog } from './dialogs/TrialBalanceSheetPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export const TrialBalanceSheetDialogs = () => {
  return (
    <>
      <TrialBalanceSheetPdfDialog
        dialogName={DialogsName.TrialBalanceSheetPdfPreview}
      />
    </>
  );
};
