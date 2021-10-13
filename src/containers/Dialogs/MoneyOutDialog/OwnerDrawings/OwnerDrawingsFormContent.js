import React from 'react';
import { Form } from 'formik';

import OwnerDrawingsFormFields from './OwnerDrawingsFormFields';
import OwnerDrawingsFloatingActions from './OwnerDrawingsFloatingActions';

/**
 * Owner drawings form content.
 */
export default function OwnerDrawingsFormContent() {
  return (
    <Form>
      <OwnerDrawingsFormFields />
      <OwnerDrawingsFloatingActions />
    </Form>
  );
}
