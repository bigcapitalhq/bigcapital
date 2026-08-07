import { Form } from 'formik';
import React from 'react';
import { QuickPaymentMadeFloatingActions } from './QuickPaymentMadeFloatingActions';
import { QuickPaymentMadeFormFields } from './QuickPaymentMadeFormFields';
/**
 * Quick payment made form content.
 */
export function QuickPaymentMadeFormContent(): React.ReactElement {
  return (
    <Form>
      <QuickPaymentMadeFormFields />
      <QuickPaymentMadeFloatingActions />
    </Form>
  );
}
