import React from 'react';
import { Form } from 'formik';

import MoneyOutFormFields from './MoneyOutFormFields';
import MoneyOutFormDialog from './MoneyOutFormDialog'
import MoneyOutFloatingActions from './MoneyOutFloatingActions';
/**
 * Money out form content.
 */
export default function MoneyOutFormContent() {
  return (
    <Form>
      <MoneyOutFormFields />
      <MoneyOutFormDialog/>
      <MoneyOutFloatingActions />
    </Form>
  );
}
