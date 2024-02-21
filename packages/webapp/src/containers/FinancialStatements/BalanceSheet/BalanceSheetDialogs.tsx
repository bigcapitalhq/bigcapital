import { DialogsName } from '@/constants/dialogs';
import { BalanceSheetPdfDialog } from './dialogs/BalanceSheetPdfDialog';

export const BalanceSheetDialogs = () => {
  return (
    <>
      <BalanceSheetPdfDialog dialogName={DialogsName.BalanceSheetPdfPreview} />
    </>
  );
};
