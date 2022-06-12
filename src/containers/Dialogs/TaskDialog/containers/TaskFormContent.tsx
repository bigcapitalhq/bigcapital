import React from 'react';
import { Form } from 'formik';
import TaskFormFields from './TaskFormFields';
import TaskFormFloatingActions from './TaskFormFloatingActions';

/**
 * Task form content.
 * @returns
 */
export default function TaskFormContent() {
  return (
    <Form>
      <TaskFormFields />
      <TaskFormFloatingActions />
    </Form>
  );
}
