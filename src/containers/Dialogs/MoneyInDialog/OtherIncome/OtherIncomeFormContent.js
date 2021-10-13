import React from 'react';
import { Form } from 'formik';

import OtherIncomeFormFields from './OtherIncomeFormFields';
import MoneyInFloatingActions from '../MoneyInFloatingActions';

/**
 * Other income form content.
 */
export default function OtherIncomeFormContent() {
  return (
    <Form>
      <OtherIncomeFormFields />
      <MoneyInFloatingActions />
    </Form>
  );
}
