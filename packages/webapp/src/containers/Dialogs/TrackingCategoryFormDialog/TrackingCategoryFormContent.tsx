import { Form } from 'formik';
import React from 'react';
import { TrackingCategoryFormFields } from './TrackingCategoryFormFields';
import { TrackingCategoryFormFloatingActions } from './TrackingCategoryFormFloatingActions';

/**
 * Tracking category form content.
 */
export function TrackingCategoryFormContent(): React.ReactElement {
  return (
    <Form>
      <TrackingCategoryFormFields />
      <TrackingCategoryFormFloatingActions />
    </Form>
  );
}
