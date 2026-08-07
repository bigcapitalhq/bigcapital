// @ts-nocheck
import { Form } from 'formik';
import React from 'react';
import { ProjectFormFields } from './ProjectFormFields';
import { ProjectFormFloatingActions } from './ProjectFormFloatingActions';

/**
 * Project form content.
 */
export function ProjectFormContent() {
  return (
    <Form>
      <ProjectFormFields />
      <ProjectFormFloatingActions />
    </Form>
  );
}
