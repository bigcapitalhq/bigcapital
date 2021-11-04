import React from 'react';
import { Form } from 'formik';

import NotifyContactViaSMSFormFields from './NotifyContactViaSMSFormFields';
import NotifyContactViaSMSFormFloatingActions from './NotifyContactViaSMSFormFloatingActions';
/**
 * Nofity contact via SMS form content.
 */
export default function NotifyContactViaSMSFormContent() {
  return (
    <Form>
      <NotifyContactViaSMSFormFields />
      <NotifyContactViaSMSFormFloatingActions />
    </Form>
  );
}
