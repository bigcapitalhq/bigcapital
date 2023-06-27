// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import EstimatedExpenseFormFields from './EstimatedExpenseFormFields';
import EstimatedExpenseFormFloatingActions from './EstimatedExpenseFormFloatingActions';

/**
 * Estimated expense form content.
 * @returns
 */
export default function EstimatedExpenseFormContent() {
  return (
    <Form>
      <EstimatedExpenseFormFields />
      <EstimatedExpenseFormFloatingActions />
    </Form>
  );
}
