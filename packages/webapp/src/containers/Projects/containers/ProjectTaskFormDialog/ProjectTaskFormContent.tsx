// @ts-nocheck
import { Form } from 'formik';
import React from 'react';
import { ProjectTaskFormFields } from './ProjectTaskFormFields';
import { ProjectTaskFormFloatingActions } from './ProjectTaskFormFloatingActions';

/**
 * Task form content.
 * @returns
 */
export function TaskFormContent() {
  return (
    <Form>
      <ProjectTaskFormFields />
      <ProjectTaskFormFloatingActions />
    </Form>
  );
}
