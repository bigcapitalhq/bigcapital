import React from 'react';
import { Form } from 'formik';

import TransferFromAccountFormFields from './TransferFromAccountFormFields';
import MoneyInFloatingActions from '../MoneyInFloatingActions';

export default function TransferFromAccountFormContent() {
  return (
    <Form>
      <TransferFromAccountFormFields />
      <MoneyInFloatingActions />
    </Form>
  );
}
