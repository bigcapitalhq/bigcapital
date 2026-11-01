import * as FF from 'fp-ts/function';
import React from 'react';
import {
  TransactionsLockingList,
  TransactionsLockingFull,
  TransactionLockingSkeletonList,
} from './components';
import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface TransactionsLockingBodyProps
  extends WithDialogActionsProps,
    WithAlertActionsProps {}

/**
 * Transactions locking body.
 * @returns {JSX}
 */
function TransactionsLockingBodyJsx({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,
}: TransactionsLockingBodyProps) {
  const { isTransactionLockingLoading, transactionLockingType } =
    useTransactionsLockingContext();

  // Handle locking transactions.
  const handleLockTransactions = (module: string) => {
    openDialog('locking-transactions', { module: module });
  };
  // Handle editing the locking transactions.
  const handleEditLockTransactions = (module: string, isEnabled: boolean) => {
    openDialog('locking-transactions', {
      isEnabled: isEnabled,
      module: module,
    });
  };
  // Handle unlocking transactions
  const handleUnlockTransactions = (module: string) => {
    openDialog('unlocking-transactions', { module: module });
  };
  // Handle unlocking transactions
  const handleUnlockingPartial = (module: string) => {
    openDialog('unlocking-partial-transactions', { module: module });
  };
  // Handle cancel partial unlocking.
  const handleCancelUnlockingPartail = (module: string) => {
    openAlert('cancel-unlocking-partail', { module: module });
  };

  return !isTransactionLockingLoading ? (
    transactionLockingType === 'partial' ? (
      <TransactionsLockingList
        onLock={handleLockTransactions}
        onEditLock={handleEditLockTransactions}
        onCancelLock={handleUnlockTransactions}
        onUnlockPartial={handleUnlockingPartial}
        onCancelUnlockPartial={handleCancelUnlockingPartail}
      />
    ) : (
      <TransactionsLockingFull
        onLock={handleLockTransactions}
        onCancelLock={handleUnlockTransactions}
        onUnlockPartial={handleUnlockingPartial}
        onCancelUnlockPartial={handleCancelUnlockingPartail}
      />
    )
  ) : (
    <TransactionLockingSkeletonList />
  );
}

export const TransactionsLockingBody = FF.pipe(
  TransactionsLockingBodyJsx,
  withDialogActions,
  withAlertActions,
);
