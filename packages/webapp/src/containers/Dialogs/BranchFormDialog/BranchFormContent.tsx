import { Form } from 'formik';
import React from 'react';
import { BranchFormFields } from './BranchFormFields';
import { BranchFormFloatingActions } from './BranchFormFloatingActions';

/**
 * Branch form content.
 */
export function BranchFormContent(): React.ReactElement {
  return (
    <Form>
      <BranchFormFields />
      <BranchFormFloatingActions />
    </Form>
  );
}
