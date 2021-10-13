import React from 'react';
import { Form } from 'formik';

import OwnerContributionFormFields from './OwnerContributionFormFields';
import MoneyInFloatingActions from '../MoneyInFloatingActions';

/**
 * Owner contribution form content.
 */
export default function OwnerContributionFormContent() {
  return (
    <Form>
      <OwnerContributionFormFields />
      <MoneyInFloatingActions />
    </Form>
  );
}
