import { useHistory } from 'react-router-dom';
import { TRANSACTIONS_LOCKING_LINK } from './overviewLinks';
import type { LockData } from './useOverviewData';
import { DialogsName } from '@/constants/dialogs';
import { useDialogActions } from '@/hooks/state';

/**
 * Opens the existing lock dialog for the month that is ready to lock, with
 * its last day filled in. Shared by the status sentence and the Tasks panel.
 */
export function useLockMonth(lock: LockData | null) {
  const history = useHistory();
  const { openDialog } = useDialogActions();

  return () => {
    const readyMonth = lock?.readyMonth;
    if (!readyMonth) return;
    if (lock?.canLockAll) {
      openDialog(DialogsName.TransactionsLocking, {
        module: 'all',
        lockToDate: readyMonth.end,
      });
    } else {
      // module-by-module locking is managed on its own page.
      history.push(TRANSACTIONS_LOCKING_LINK);
    }
  };
}
