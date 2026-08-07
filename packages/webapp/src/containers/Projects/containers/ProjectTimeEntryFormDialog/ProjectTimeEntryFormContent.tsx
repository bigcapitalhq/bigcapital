// @ts-nocheck
import { Form } from 'formik';
import React from 'react';
import { ProjectTimeEntryFormFields } from './ProjectTimeEntryFormFields';
import { ProjectTimeEntryFormFloatingActions } from './ProjectTimeEntryFormFloatingActions';

/**
 * Time entry form content.
 * @returns
 */
export function TimeEntryFormContent() {
  return (
    <Form>
      <ProjectTimeEntryFormFields />
      <ProjectTimeEntryFormFloatingActions />
    </Form>
  );
}
