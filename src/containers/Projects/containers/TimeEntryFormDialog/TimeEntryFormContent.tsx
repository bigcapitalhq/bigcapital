import React from 'react';
import { Form } from 'formik';
import TimeEntryFormFields from './TimeEntryFormFields';
import TimeEntryFormFloatingActions from './TimeEntryFormFloatingActions';

/**
 * Time entry form content.
 * @returns
 */
export default function TimeEntryFormContent() {
  return (
    <Form>
      <TimeEntryFormFields />
      <TimeEntryFormFloatingActions />
    </Form>
  );
}
