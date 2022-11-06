// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import BranchFormFields from './BranchFormFields';
import BranchFormFloatingActions from './BranchFormFloatingActions';

/**
 * Branch form content.
 */
export default function BranchFormContent() {
  return (
    <Form>
      <BranchFormFields />
      <BranchFormFloatingActions />
    </Form>
  );
}
