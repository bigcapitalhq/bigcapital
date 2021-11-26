import React from 'react';
import { TransactionsLockingFormProvider } from './TransactionsLockingFormProvider';
import TransactionsLockingForm from './TransactionsLockingForm';

export default function TransactionsLockingDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <TransactionsLockingFormProvider dialogName={dialogName}>
      <TransactionsLockingForm />
    </TransactionsLockingFormProvider>
  );
}
