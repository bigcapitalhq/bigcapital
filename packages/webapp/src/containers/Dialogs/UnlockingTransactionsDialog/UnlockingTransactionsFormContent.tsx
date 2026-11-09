import { Form } from 'formik';
import React from 'react';
import { UnlockingTransactionsFormFields } from './UnlockingTransactionsFormFields';
import { UnlockingTransactionsFormFloatingActions } from './UnlockingTransactionsFormFloatingActions';

/**
 * Unlocking transactions form content.
 */
export function UnlockingTransactionsFormContent(): React.ReactElement {
  return (
    <Form>
      <UnlockingTransactionsFormFields />
      <UnlockingTransactionsFormFloatingActions />
    </Form>
  );
}
