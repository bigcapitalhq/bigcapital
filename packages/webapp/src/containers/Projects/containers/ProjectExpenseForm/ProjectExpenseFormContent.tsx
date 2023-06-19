// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import ProjectExpenseFormFields from './ProjectExpenseFormFields';
import ProjectExpenseFormFloatingActions from './ProjectExpenseFormFloatingActions';

/**
 * Expense form content.
 * @returns
 */
export default function ProjectExpenseFormContent() {
  return (
    <Form>
      <ProjectExpenseFormFields />
      <ProjectExpenseFormFloatingActions />
    </Form>
  );
}
