// @ts-nocheck
import { Form } from 'formik';
import React from 'react';
import { EstimatedExpenseFormFields } from './EstimatedExpenseFormFields';
import { EstimatedExpenseFormFloatingActions } from './EstimatedExpenseFormFloatingActions';

/**
 * Estimated expense form content.
 * @returns
 */
export function EstimatedExpenseFormConent() {
  return (
    <Form>
      <EstimatedExpenseFormFields />
      <EstimatedExpenseFormFloatingActions />
    </Form>
  );
}
