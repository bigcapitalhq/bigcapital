import React from 'react';
import { Form } from 'formik';

import TransferToAccountFormFields from './TransferToAccountFormFields';
import TransferToAccountFloatingActions from './TransferToAccountFloatingActions';

export default function TransferToAccountFromContent() {
  return (
    <Form>
      <TransferToAccountFormFields />
      <TransferToAccountFloatingActions />
    </Form>
  );
}
