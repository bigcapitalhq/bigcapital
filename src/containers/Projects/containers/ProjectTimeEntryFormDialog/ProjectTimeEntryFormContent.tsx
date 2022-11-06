// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import ProjectTimeEntryFormFields from './ProjectTimeEntryFormFields';
import ProjectTimeEntryFormFloatingActions from './ProjectTimeEntryFormFloatingActions';

/**
 * Time entry form content.
 * @returns
 */
export default function TimeEntryFormContent() {
  return (
    <Form>
      <ProjectTimeEntryFormFields />
      <ProjectTimeEntryFormFloatingActions />
    </Form>
  );
}
