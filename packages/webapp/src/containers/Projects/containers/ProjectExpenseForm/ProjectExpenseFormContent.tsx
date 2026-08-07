// @ts-nocheck
import { Form } from 'formik';
import React from 'react';
import { ProjectExpenseFormFields } from './ProjectExpenseFormFields';
import { ProjectExpneseFormFloatingActions } from './ProjectExpneseFormFloatingActions';

/**
 * Expense form content.
 * @returns
 */
export function ProjectExpenseFormContent() {
  return (
    <Form>
      <ProjectExpenseFormFields />
      <ProjectExpneseFormFloatingActions />
    </Form>
  );
}
