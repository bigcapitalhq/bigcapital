// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import QuickPaymentReceiveFormFields from './QuickPaymentReceiveFormFields';
import QuickPaymentReceiveFloatingActions from './QuickPaymentReceiveFloatingActions';

/**
 * Quick payment receive form content.
 */
export default function QuickPaymentReceiveFormContent() {
  return (
    <Form>
      <QuickPaymentReceiveFormFields />
      <QuickPaymentReceiveFloatingActions />
    </Form>
  );
}
