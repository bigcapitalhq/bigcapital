// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import ProjectFormFields from './ProjectFormFields';
import ProjectFormFloatingActions from './ProjectFormFloatingActions';

/**
 * Project form content.
 */
export default function ProjectFormContent() {
  return (
    <Form>
      <ProjectFormFields />
      <ProjectFormFloatingActions />
    </Form>
  );
}
