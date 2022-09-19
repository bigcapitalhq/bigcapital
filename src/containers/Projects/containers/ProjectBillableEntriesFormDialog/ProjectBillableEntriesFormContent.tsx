// @ts-nocheck

import React from 'react';
import { Form } from 'formik';
import ProjectBillableEntriesFormFields from './ProjectBillableEntriesFormFields';
import ProjectBillableEntriesFormFloatingActions from './ProjectBillableEntriesFormFloatingActions';

/**
 * Project billable entries form content.
 * @returns
 */
export default function ProjectBillableEntriesFormContent() {
  return (
    <Form>
      <ProjectBillableEntriesFormFields />
      <ProjectBillableEntriesFormFloatingActions />
    </Form>
  );
}
