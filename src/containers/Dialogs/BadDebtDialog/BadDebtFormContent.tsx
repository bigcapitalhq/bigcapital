// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import BadDebtFormFields from './BadDebtFormFields';
import BadDebtFormFloatingActions from './BadDebtFormFloatingActions';

/**
 * Bad debt form content.
 */
export default function BadDebtFormContent() {
  return (
    <Form>
      <BadDebtFormFields />
      <BadDebtFormFloatingActions />
    </Form>
  );
}
