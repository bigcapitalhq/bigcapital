import { DialogsName } from '@/constants/dialogs';
import { AccountBulkDeleteDialog } from '@/containers/Dialogs/Accounts/AccountBulkDeleteDialog';

export function AccountsChartDialogs() {
  return (
    <>
      <AccountBulkDeleteDialog dialogName={DialogsName.AccountBulkDelete} />
    </>
  );
}
