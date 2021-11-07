import React from 'react';
import { Form } from 'formik';

import SMSMessageFormFields from './SMSMessageFormFields';
import SMSMessageFormFloatingActions from './SMSMessageFormFloatingActions';

/**
 * SMS message form content.
 */
export default function SMSMessageFormContent() {
  return (
    <Form>
      <SMSMessageFormFields />
      <SMSMessageFormFloatingActions />
    </Form>
  );
}
