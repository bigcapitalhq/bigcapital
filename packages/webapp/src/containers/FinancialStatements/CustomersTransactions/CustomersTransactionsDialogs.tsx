import { CustomerTransactionsPdfDialog } from './dialogs/CustomerTransactionsPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function CustomersTransactionsDialogs() {
  return (
    <>
      <CustomerTransactionsPdfDialog
        dialogName={DialogsName.CustomerTransactionsPdfPreview}
      />
    </>
  );
}
