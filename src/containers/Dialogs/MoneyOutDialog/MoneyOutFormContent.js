import React from 'react';
import { Form } from 'formik';

import MoneyOutFormFields from './MoneyOutFormFields';
import MoneyOutFloatingActions from './MoneyOutFloatingActions';

/**
 * Money out form content.
 */
export default function MoneyOutFormContent() {
  return (
    <Form>
      <MoneyOutFormFields />
      <MoneyOutFloatingActions />
    </Form>
  );
}
