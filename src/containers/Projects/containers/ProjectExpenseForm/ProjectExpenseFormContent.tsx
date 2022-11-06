// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import ProjectExpenseFormFields from './ProjectExpenseFormFields';
import ProjectExpneseFormFloatingActions from './ProjectExpneseFormFloatingActions';

/**
 * Expense form content.
 * @returns
 */
export default function ProjectExpenseFormContent() {
  return (
    <Form>
      <ProjectExpenseFormFields />
      <ProjectExpneseFormFloatingActions />
    </Form>
  );
}
