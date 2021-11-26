import React from 'react';
import { Form } from 'formik';

import TransactionsLockingFormFields from './TransactionsLockingFormFields';
import TransactionsLockingFloatingActions from './TransactionsLockingFloatingActions';

/**
 * Transactions locking form content.
 */
export default function TransactionsLockingFormContent() {
  return (
    <Form>
      <TransactionsLockingFormFields />
      <TransactionsLockingFloatingActions />
    </Form>
  );
}
