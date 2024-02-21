import { DialogsName } from '@/constants/dialogs';
import { CustomerTransactionsPdfDialog } from './dialogs/CustomerTransactionsPdfDialog';

export function CustomersTransactionsDialogs() {
  return (
    <>
      <CustomerTransactionsPdfDialog
        dialogName={DialogsName.CustomerTransactionsPdfPreview}
      />
    </>
  );
}
