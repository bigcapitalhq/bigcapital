import React from 'react';
import { Form } from 'formik';

import OtherExpnseFormFields from './OtherExpnseFormFields';
import OtherExpenseFloatingActions from './OtherExpenseFloatingActions';

/**
 * Other expense form content.
 */
export default function OtherExpenseFormContent() {
  return (
    <Form>
      <OtherExpnseFormFields />
      <OtherExpenseFloatingActions />
    </Form>
  );
}
