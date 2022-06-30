import React from 'react';
import { Form } from 'formik';
import ExpenseFormFields from './ExpenseFormFields';
import ExpneseFormFloatingActions from './ExpneseFormFloatingActions';

/**
 * Expense form content.
 * @returns
 */
export default function ExpenseFormContent() {
  return (
    <Form>
      <ExpenseFormFields />
      <ExpneseFormFloatingActions />
    </Form>
  );
}
