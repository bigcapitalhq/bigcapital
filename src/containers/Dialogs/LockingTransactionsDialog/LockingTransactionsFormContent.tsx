// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import LockingTransactionsFormFields from './LockingTransactionsFormFields';
import LockingTransactionsFormFloatingActions from './LockingTransactionsFormFloatingActions';

/**
 * locking Transactions form content.
 */
export default function LockingTransactionsFormContent() {
  return (
    <Form>
      <LockingTransactionsFormFields />
      <LockingTransactionsFormFloatingActions />
    </Form>
  );
}
