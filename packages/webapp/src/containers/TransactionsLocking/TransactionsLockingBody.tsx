// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import {
  TransactionsLockingList,
  TransactionsLockingFull,
  TransactionLockingSkeletonList,
} from './components';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';

import { useTransactionsLockingContext } from './TransactionsLockingProvider';

/**
 * Transactions locking body.
 * @returns {JSX}
 */
function TransactionsLockingBodyJsx({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,
}) {
  const { isTransactionLockingLoading, transactionLockingType } =
    useTransactionsLockingContext();

  // Handle locking transactions.
  const handleLockingTransactions = (module, {}, isEnabled) => {
    openDialog('locking-transactions', {
      isEnabled: isEnabled,
      module: module,
    });
  };
  // Handle unlocking transactions
  const handleUnlockTransactions = (module) => {
    openDialog('unlocking-transactions', { module: module });
  };
  // Handle unlocking transactions
  const handleUnlockingPartial = (module) => {
    openDialog('unlocking-partial-transactions', { module: module });
  };
  // Handle cancel partial unlocking.
  const handleCancelUnlockingPartial = (module) => {
    openAlert('cancel-unlocking-partial', { module: module });
  };

  return !isTransactionLockingLoading ? (
    transactionLockingType === 'partial' ? (
      <TransactionsLockingList
        onLock={handleLockingTransactions}
        onEditLock={handleLockingTransactions}
        onCancelLock={handleUnlockTransactions}
        onUnlockPartial={handleUnlockingPartial}
        onCancelUnlockPartial={handleCancelUnlockingPartial}
      />
    ) : (
      <TransactionsLockingFull
        onLock={handleLockingTransactions}
        onCancelLock={handleUnlockTransactions}
        onUnlockPartial={handleUnlockingPartial}
        onCancelUnlockPartial={handleCancelUnlockingPartial}
      />
    )
  ) : (
    <TransactionLockingSkeletonList />
  );
}

export const TransactionsLockingBody = R.compose(
  withAlertsActions,
  withDialogActions,
)(TransactionsLockingBodyJsx);
