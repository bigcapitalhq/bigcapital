// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import ProjectTaskFormFields from './ProjectTaskFormFields';
import ProjectTaskFormFloatingActions from './ProjectTaskFormFloatingActions';

/**
 * Task form content.
 * @returns
 */
export default function TaskFormContent() {
  return (
    <Form>
      <ProjectTaskFormFields />
      <ProjectTaskFormFloatingActions />
    </Form>
  );
}
