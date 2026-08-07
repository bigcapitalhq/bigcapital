import { Form } from 'formik';
import React from 'react';
import { BadDebtFormFields } from './BadDebtFormFields';
import { BadDebtFormFloatingActions } from './BadDebtFormFloatingActions';

/**
 * Bad debt form content.
 */
export function BadDebtFormContent(): React.ReactElement {
  return (
    <Form>
      <BadDebtFormFields />
      <BadDebtFormFloatingActions />
    </Form>
  );
}
