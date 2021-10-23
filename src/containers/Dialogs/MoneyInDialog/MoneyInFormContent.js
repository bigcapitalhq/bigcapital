import React from 'react';
import { Form } from 'formik';

import MoneyInFormFields from './MoneyInFormFields';
import MoneyInFloatingActions from './MoneyInFloatingActions';

/**
 * Money In form content.
 */
export default function MoneyInFormContent() {
  return (
    <Form>
      <MoneyInFormFields />
      <MoneyInFloatingActions />
    </Form>
  );
}
