import { DialogsName } from '@/constants/dialogs';
import { CustomerBulkDeleteDialog } from '@/containers/Dialogs/Customers/CustomerBulkDeleteDialog';

export function CustomersListDialogs() {
  return (
    <>
      <CustomerBulkDeleteDialog dialogName={DialogsName.CustomerBulkDelete} />
    </>
  );
}
