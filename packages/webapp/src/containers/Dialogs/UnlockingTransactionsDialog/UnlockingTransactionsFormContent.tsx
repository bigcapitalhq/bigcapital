// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import UnlockingTransactionsFormFields from './UnlockingTransactionsFormFields';
import UnlockingTransactionsFormFloatingActions from './UnlockingTransactionsFormFloatingActions';

/**
 * Unlocking transactions form content.
 */
export default function UnlockingTransactionsFormContent() {
  return (
    <Form>
      <UnlockingTransactionsFormFields />
      <UnlockingTransactionsFormFloatingActions />
    </Form>
  );
}
